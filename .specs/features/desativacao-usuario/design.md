# Desativacao de Usuario - Design

**Spec**: `.specs/features/desativacao-usuario/spec.md`
**Status**: Draft
**Fundacao**: Componentes compartilhados definidos em `cadastro-usuario/design.md`

---

## Architecture Overview

Os fluxos de desativacao e troca de senha reutilizam a infraestrutura definida no design de cadastro-usuario. Ambos sao operacoes de mutacao no agregado User existente.

### Fluxo: Desativacao

```
PATCH /api/users/me/deactivate
Header: Authorization: Bearer <JWT>
       ▼
JwtAuthenticationFilter popula SecurityContext (UserId)
       ▼
UserController.deactivate(@AuthenticationPrincipal UserId)
       ▼
DeactivateUserUseCase.execute(command)
  1. findById(userId) → UserNotFoundException
  2. wasActive = user.isActive()
  3. user.deactivate() → active = false (idempotente — nao valida active)
  4. repository.save(user)
  5. if (wasActive) publish UserDeactivatedEvent
       ▼
204 No Content
```

### Fluxo: Troca de Senha

```
PATCH /api/users/me/password
Header: Authorization: Bearer <JWT>
Body: { "currentPassword": "...", "newPassword": "..." }
       ▼
JwtAuthenticationFilter popula SecurityContext (UserId)
       ▼
UserController.changePassword(@AuthenticationPrincipal UserId, request)
       ▼
ChangePasswordUseCase.execute(command)
  1. findById(userId) → UserNotFoundException
  2. passwordHasher.matches(current, stored) → InvalidPasswordException (422)
  3. passwordHasher.hash(newPassword)
  4. user.changePassword(newHash) → InactiveUserException se !active (invariante no dominio)
  5. repository.save(user)
  6. publish PasswordChangedEvent
       ▼
204 No Content
```

**Nota de seguranca:** Ambos os endpoints extraem `UserId` do JWT via `@AuthenticationPrincipal`. NAO ha userId no path — impede que usuario A atue sobre conta de usuario B.

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component | Location | How to Use |
|---|---|---|
| DeactivateUserUseCase | `users/application/` | Ja implementado — adicionar event publishing |
| ChangePasswordUseCase | `users/application/` | Ja implementado — adicionar event publishing |
| DeactivateUserCommand | `users/application/command/` | Ja implementado |
| ChangePasswordCommand | `users/application/command/` | Ja implementado |
| User.deactivate() | `users/domain/User.java` | Ja implementado |
| User.changePassword() | `users/domain/User.java` | Ja implementado |
| InvalidPasswordException | `users/domain/exceptions/` | Ja implementado |
| UserNotFoundException | `users/domain/exceptions/` | Ja implementado |
| JdbcUserRepository | `users/infra/persistence/` | save() atualiza campos do user (UPDATE) |
| UserExceptionHandler | `users/api/` | Exceptions ja mapeadas (404, 401) |

### O que NAO precisa ser criado nesta feature

- Nenhuma tabela nova
- Nenhum mapper novo
- Nenhum use case novo — apenas adicionar event publishing aos existentes

---

## Components (novos ou modificados)

### ChangePasswordRequest (API DTO — novo)

- **Purpose**: Request body para troca de senha
- **Location**: `users/api/ChangePasswordRequest.java`
- **Definition**:
  ```java
  public record ChangePasswordRequest(
      @NotBlank String currentPassword,
      @NotBlank String newPassword
  ) {}
  ```

### UserDeactivatedEvent (Domain Event — novo)

- **Purpose**: Evento publicado apos desativacao de usuario
- **Location**: `users/domain/UserDeactivatedEvent.java`
- **Definition**:
  ```java
  public record UserDeactivatedEvent(
      UUID userId,
      Instant timestamp
  ) {}
  ```

### PasswordChangedEvent (Domain Event — novo)

- **Purpose**: Evento publicado apos troca de senha (sem conteudo da senha)
- **Location**: `users/domain/PasswordChangedEvent.java`
- **Definition**:
  ```java
  public record PasswordChangedEvent(
      UUID userId,
      Instant timestamp
  ) {}
  ```

### DeactivateUserUseCase (modificacao)

- **Mudanca**: Adicionar `ApplicationEventPublisher` e publicar `UserDeactivatedEvent` apos save

### ChangePasswordUseCase (modificacao)

- **Mudanca**: Adicionar `ApplicationEventPublisher` e publicar `PasswordChangedEvent` apos save

---

## Edge Case: Troca de senha por usuario desativado

A spec define que usuario desativado nao pode trocar senha. Como `active=true` eh **invariante do agregado** para qualquer mutacao, a guarda vive no dominio (em `User.changePassword()`), NAO no use case.

**Solucao (no dominio):** Adicionar guarda em `User.changePassword(...)`:

```java
public void changePassword(PasswordHash newPasswordHash) {
    if (!this.active) {
        throw new InactiveUserException("Cannot change password for inactive user");
    }
    this.passwordHash = newPasswordHash;
}
```

**Rationale:** Invariantes do agregado sao validados no agregado. O use case confia no dominio e nao duplica a validacao. Mesmo padrao aplicado em `User.createProviderProfile()`.

**Localizacao da exception:** `users/domain/exceptions/InactiveUserException.java` — compartilhada entre features. Mapeada para **403 Forbidden**.

---

## Design: Idempotencia da desativacao

O comportamento atual de `User.deactivate()` ja eh idempotente — `active = false` pode ser setado multiplas vezes sem efeito colateral.

**Decisao sobre evento**: Publicar `UserDeactivatedEvent` apenas quando o usuario estava ativo antes da desativacao. Evita eventos espurios.

```java
// No DeactivateUserUseCase
boolean wasActive = user.isActive();
user.deactivate();
repository.save(user);
if (wasActive) {
    eventPublisher.publishEvent(new UserDeactivatedEvent(...));
}
```

---

## Tech Decisions

| Decision | Choice | Rationale |
|---|---|---|
| HTTP method desativacao | PATCH (nao DELETE) | Soft delete — recurso nao eh removido, estado eh mutado |
| HTTP method senha | PATCH | Mutacao parcial de recurso existente |
| Endpoint path | `/api/users/me/*` — userId do JWT, nao do path | Impede que usuario A opere na conta de B |
| UserId da requisicao | `@AuthenticationPrincipal` extrai do JWT | Unica fonte confiavel de identidade em rotas protegidas |
| Response status sucesso | 204 No Content | Operacao bem-sucedida sem corpo de resposta |
| Status InvalidPassword | 422 Unprocessable Entity | JWT ja autenticou — senha atual errada eh entrada semanticamente invalida, nao falha de autenticacao |
| Status InactiveUser | 403 Forbidden | Usuario autenticado mas sem permissao de operar (desativado) |
| Evento condicional | Publicar apenas se estado mudou | Evita eventos duplicados em chamadas idempotentes |
| Guarda usuario ativo | Invariante no dominio — `User.changePassword()` lanca `InactiveUserException` | Regra de negocio vive no agregado, use case nao duplica |
| Localizacao InactiveUserException | `users/domain/exceptions/` | Compartilhada entre features, nao vive em pacote de feature especifica |
| Idempotencia desativacao | `User.deactivate()` NAO valida `active` | Permite desativacao repetida sem erro — unica excecao a invariante de `active=true` para mutacoes |
| Senha no evento | Nunca inclui senha | PasswordChangedEvent contem apenas userId + timestamp — seguranca |

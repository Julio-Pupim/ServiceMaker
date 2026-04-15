# Perfil de Prestador - Design

**Spec**: `.specs/features/perfil-prestador/spec.md`
**Status**: Draft
**Fundacao**: Componentes compartilhados definidos em `cadastro-usuario/design.md`

---

## Architecture Overview

O fluxo de criacao de perfil de prestador reutiliza toda a infraestrutura definida no design de cadastro-usuario. Apenas as particularidades do fluxo sao documentadas aqui.

```
┌───────────────────────────────────────────────────────────┐
│  POST /api/users/me/provider-profile                      │
│  Header: Authorization: Bearer <JWT>                      │
│  Body: { "description": "Eletricista com 10 anos..." }   │
└──────────────────────┬────────────────────────────────────┘
                       ▼
┌───────────────────────────────────────────────────────────┐
│  JwtAuthenticationFilter valida JWT e popula              │
│  SecurityContext com UserId (principal)                    │
└──────────────────────┬────────────────────────────────────┘
                       ▼
┌───────────────────────────────────────────────────────────┐
│  UserController.createProviderProfile(                    │
│     @AuthenticationPrincipal UserId, request)              │
│  → converte para CreateProviderProfileCommand             │
└──────────────────────┬────────────────────────────────────┘
                       ▼
┌───────────────────────────────────────────────────────────┐
│  CreateProviderProfileUseCase.execute(command)             │
│  1. findById(userId) → UserNotFoundException se nao existe │
│  2. user.createProviderProfile(description)                │
│     → InactiveUserException se !active (invariante)        │
│     → IllegalStateException se perfil ja existe            │
│     → adiciona role PROVIDER                               │
│  3. repository.save(user)                                  │
│  4. publish ProviderProfileCreatedEvent                    │
└──────────────────────┬────────────────────────────────────┘
                       ▼
┌───────────────────────────────────────────────────────────┐
│  JdbcUserRepository.save(user)                            │
│  → UPDATE users.users (nao muda, mas salva agregado)      │
│  → INSERT users.provider_profiles                         │
│  → INSERT users.user_roles (role PROVIDER)                │
└───────────────────────────────────────────────────────────┘
```

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component | Location | How to Use |
|---|---|---|
| CreateProviderProfileUseCase | `users/application/` | Ja implementado — adicionar event publishing |
| CreateProviderProfileCommand | `users/application/command/` | Ja implementado — usar como esta |
| User.createProviderProfile() | `users/domain/User.java` | Ja implementado — logica de negocio intacta |
| ProviderProfile | `users/domain/ProviderProfile.java` | Ja implementado — rating e reviewCount inicializados |
| JdbcUserRepository | `users/infra/persistence/` | Definido no design de cadastro-usuario — save() ja lida com profiles |
| UserExceptionHandler | `users/api/` | Definido no design de cadastro-usuario — IllegalStateException → 409 |
| UserController | `users/api/` | Definido no design de cadastro-usuario — adicionar endpoint |

### O que NAO precisa ser criado nesta feature

- Nenhuma tabela nova (provider_profiles ja esta na migration de cadastro-usuario)
- Nenhum mapper novo (UserEntityMapper ja lida com profiles)
- Nenhum exception handler novo (IllegalStateException e UserNotFoundException ja mapeados)

---

## Components (novos ou modificados)

### CreateProviderProfileRequest (API DTO — novo)

- **Purpose**: Request body para criacao de perfil de prestador
- **Location**: `users/api/CreateProviderProfileRequest.java`
- **Definition**:
  ```java
  public record CreateProviderProfileRequest(
      @NotBlank String description
  ) {}
  ```

### ProviderProfileCreatedEvent (Domain Event — novo)

- **Purpose**: Evento publicado apos criacao de perfil de prestador
- **Location**: `users/domain/ProviderProfileCreatedEvent.java`
- **Definition**:
  ```java
  public record ProviderProfileCreatedEvent(
      UUID userId,
      String description,
      Instant timestamp
  ) {}
  ```

### CreateProviderProfileUseCase (modificacao)

- **Mudanca**: Adicionar `ApplicationEventPublisher` como dependencia e publicar `ProviderProfileCreatedEvent` apos save
- **Reuses**: Logica existente intacta

---

## Edge Case: Usuario desativado criando perfil

A spec define que usuario desativado (active=false) nao pode criar perfil de prestador. Como `active=true` eh **invariante do agregado** para qualquer mutacao, a guarda vive no dominio, NAO no use case.

**Solucao (no dominio):** Adicionar guarda em `User.createProviderProfile(...)`:

```java
public void createProviderProfile(String description) {
    if (!this.active) {
        throw new InactiveUserException("Cannot create provider profile for inactive user");
    }
    if (this.providerProfile != null) {
        throw new IllegalStateException("User already has a provider profile");
    }
    // ... resto da logica existente
}
```

**Rationale:** Regras de negocio ficam centralizadas no agregado. O use case nao precisa duplicar a validacao — ele chama `user.createProviderProfile(...)` e propaga a exception.

**Localizacao da exception:** `users/domain/exceptions/InactiveUserException.java` — compartilhada entre features (troca de senha, criacao de perfil, futuras operacoes que exigem usuario ativo). Mapeada para **403 Forbidden** pelo `UserExceptionHandler`.

---

## Tech Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Validacao de usuario ativo | Guarda no dominio (`User.createProviderProfile()`) | Invariante do agregado — qualquer mutacao exige active=true. Regra de negocio centralizada no dominio. |
| UserId da requisicao | Extraido do JWT via `@AuthenticationPrincipal` — endpoint /me/* | Impede que usuario A crie perfil para usuario B |
| Endpoint HTTP method | POST (nao PATCH) | Criacao de recurso novo (perfil) — POST eh semanticamente correto |
| Endpoint path | `/api/users/me/provider-profile` | `/me` deixa claro que a acao eh sobre o proprio usuario autenticado |
| Response status | 201 Created | Recurso novo foi criado |
| InactiveUserException | Localizada em `users/domain/exceptions/` | Compartilhada entre features — nao vive no pacote de feature especifica |

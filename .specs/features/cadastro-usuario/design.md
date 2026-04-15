# Cadastro de Usuario - Design

**Spec**: `.specs/features/cadastro-usuario/spec.md`
**Status**: Draft

---

## Architecture Overview

O design cobre a fundacao compartilhada do modulo Users (persistencia, migrations, API, error handling) alem do fluxo de registro. Os designs de `perfil-prestador` e `desativacao-usuario` referenciam componentes definidos aqui.

```
┌─────────────────────────────────────────────────────────┐
│                    HTTP Request                          │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────┐
│  api/UserController                                      │
│  POST /api/users → RegisterUserRequest                   │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────┐
│  application/RegisterUserUseCase                         │
│  execute(RegisterUserCommand) → UserId                   │
│  1. check email uniqueness                               │
│  2. check CPF uniqueness                                 │
│  3. hash password (via PasswordHasher — port do use case)│
│  4. User.registerUser() (aplica invariantes de dominio)  │
│  5. repository.save()                                    │
│  6. publish UserRegisteredEvent                          │
└──────────┬──────────────────────┬───────────────────────┘
           ▼                      ▼
┌──────────────────┐  ┌──────────────────────────────────────┐
│  domain/          │  │  domain/PasswordHasher (port)        │
│  UserRepository   │  │  → BCryptPasswordHasher (infra)      │
│  (port)           │  │  Obs: consumido pelo use case, nao   │
│                   │  │  pelo agregado. User manipula        │
│                   │  │  apenas PasswordHash (VO).           │
└────────┬─────────┘  └──────────────────────────────────────┘
         ▼
┌──────────────────────────────────────────────────────────┐
│  infra/persistence/JdbcUserRepository                    │
│  NamedParameterJdbcTemplate + UserEntityMapper           │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────┐
│  PostgreSQL (schema: users)                              │
│  users.users | users.user_roles | users.client_profiles  │
│  users.provider_profiles                                 │
└──────────────────────────────────────────────────────────┘
```

---

## Invariantes do agregado User (aplicadas no dominio)

O agregado `User` garante os seguintes invariantes. Qualquer operacao que viole um invariante falha **antes** de mutar o estado — use cases confiam no agregado.

| Invariante | Aplicado em | Exception |
|---|---|---|
| Email valido | VO `Email.of(...)` | `IllegalArgumentException` |
| CPF valido (11 digitos) | VO `Cpf.of(...)` | `IllegalArgumentException` |
| Nome valido (>= 2 chars) | VO `UserName.of(...)` | `IllegalArgumentException` |
| Senha nunca em texto plano | VO `PasswordHash` — so aceita hash | (construcao falha sem hash) |
| `active=true` eh pre-condicao de mutacao | Metodos do agregado (`changePassword`, `createProviderProfile`, etc.) | `InactiveUserException` |
| Perfil de prestador unico | `User.createProviderProfile(...)` | `IllegalStateException` |
| Role consistente com perfil | `User.createProviderProfile(...)` adiciona role PROVIDER automaticamente | — |

**Excecao a regra de `active=true`:** `User.deactivate()` eh idempotente e NAO valida `active` (permite chamadas repetidas sem erro).

**Localizacao de `InactiveUserException`:** `users/domain/exceptions/InactiveUserException.java` — compartilhada entre features (troca de senha, criacao de perfil, etc.), logo nao vive no pacote de uma feature especifica.

---

## Decisao-chave: Persistencia com NamedParameterJdbcTemplate

**Problema:** O dominio User tem construtor privado, factory methods (`registerUser()`), campos final, e `Set<UserRole>` inicializado inline. Spring Data JDBC CrudRepository precisaria de instanciacao via reflexao, que conflita com o modelo rico.

**Decisao:** Usar `NamedParameterJdbcTemplate` diretamente no `JdbcUserRepository`, com `UserEntityMapper` para hidratar o agregado User a partir de ResultSet.

**Alternativas descartadas:**
| Alternativa | Por que nao |
|---|---|
| CrudRepository + persistence entities | Overhead de entidades duplicadas + mapper sem ganho real — as queries sao poucas e simples |
| JdbcAggregateTemplate | Requer anotacoes Spring no dominio (`@Table`, `@Id`, `@MappedCollection`) — viola regra "Domain MUST NOT depend on Spring" |

**Trade-off:** Mais SQL manual, mas controle total sobre hidratacao do agregado e alinhamento com regras de arquitetura. Para 4 use cases e ~6 queries, o custo eh baixo.

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component | Location | How to Use |
|---|---|---|
| User (aggregate root) | `users/domain/User.java` | Ja implementado — manter intacto |
| RegisterUserUseCase | `users/application/RegisterUserUseCase.java` | Ja implementado — adicionar event publishing |
| PasswordHasher (port consumido por use cases) | `users/domain/PasswordHasher.java` (interface) + `infra/security/BCryptPasswordHasher.java` | Interface declarada no pacote domain (port DDD), mas consumida pelos **use cases**, NAO pelo agregado `User`. O agregado so manipula o VO `PasswordHash`. |
| Domain exceptions | `users/domain/exceptions/` | Ja implementados — mapear para HTTP no ControllerAdvice |
| Value objects | `shared/Email.java`, `Cpf.java`, `UserId.java`, `UserName.java` | Ja implementados — usar nos mappers |
| RegisterUserCommand | `users/application/command/RegisterUserCommand.java` | Ja implementado — usar como esta |
| Unit tests (domain + use case) | `src/test/java/.../users/` | Ja implementados — adicionar testes de integracao |

### Integration Points

| System | Integration Method |
|---|---|
| PostgreSQL | NamedParameterJdbcTemplate via Spring Data JDBC starter |
| Liquibase | XML changelogs em `db/changelog/` — criar migrations para tabelas do modulo |
| Spring Modulith Events | ApplicationEventPublisher nos use cases + `spring-modulith-starter-jdbc` para persistencia transacional |
| Spring Security | SecurityFilterChain permitindo POST /api/users sem auth |

---

## Components

### UserController (API)

- **Purpose**: Expor endpoints REST do modulo Users
- **Location**: `users/api/UserController.java`
- **Interfaces**:
  - `POST /api/users` → `ResponseEntity<UserIdResponse> register(RegisterUserRequest)` — publico — REG-09
  - `POST /api/users/me/provider-profile` → `ResponseEntity<Void> createProviderProfile(@AuthenticationPrincipal UserId, ...)` — protegido — PROV-05
  - `PATCH /api/users/me/password` → `ResponseEntity<Void> changePassword(@AuthenticationPrincipal UserId, ...)` — protegido — DEAC-08
  - `PATCH /api/users/me/deactivate` → `ResponseEntity<Void> deactivate(@AuthenticationPrincipal UserId)` — protegido — DEAC-07
- **Dependencies**: RegisterUserUseCase, CreateProviderProfileUseCase, ChangePasswordUseCase, DeactivateUserUseCase
- **Seguranca**: Endpoints `/me/*` extraem `UserId` do JWT via `@AuthenticationPrincipal` — evita que um usuario opere conta de outro.
- **Reuses**: Use cases existentes

### RegisterUserRequest (API DTO)

- **Purpose**: Request body para registro — validacao Bean Validation na borda HTTP
- **Location**: `users/api/RegisterUserRequest.java`
- **Definition**:
  ```java
  public record RegisterUserRequest(
      @NotBlank String email,
      @NotBlank String cpf,
      @NotBlank String password,
      @NotBlank String name
  ) {}
  ```
- **Dependencies**: Nenhuma
- **Reuses**: Nenhum — novo record

### UserIdResponse (API DTO)

- **Purpose**: Response body com ID gerado
- **Location**: `users/api/UserIdResponse.java`
- **Definition**:
  ```java
  public record UserIdResponse(UUID id) {}
  ```

### UserExceptionHandler (Error Handling)

- **Purpose**: Mapear domain exceptions para HTTP status codes
- **Location**: `users/api/UserExceptionHandler.java`
- **Interfaces**:
  ```
  EmailAlreadyExistsException   → 409 Conflict
  CpfAlreadyExistsException     → 409 Conflict
  UserNotFoundException          → 404 Not Found
  InvalidPasswordException       → 422 Unprocessable Entity (senha atual nao bate)
  InactiveUserException          → 403 Forbidden (usuario desativado)
  IllegalStateException          → 409 Conflict (provider profile duplicado)
  IllegalArgumentException       → 400 Bad Request (validacao de VOs)
  MethodArgumentNotValidException → 400 Bad Request (Bean Validation)
  ```
- **Dependencies**: Nenhuma
- **Reuses**: Domain exceptions existentes
- **Nota**: `@RestControllerAdvice(basePackages = "br.com.serviceMaker.users.api")` — escopo limitado ao modulo

### ErrorResponse (API DTO)

- **Purpose**: Formato padrao de resposta de erro
- **Location**: `users/api/ErrorResponse.java`
- **Definition**:
  ```java
  public record ErrorResponse(String message, int status) {}
  ```

### JdbcUserRepository (Persistence — rewrite)

- **Purpose**: Implementar UserRepository com SQL real via NamedParameterJdbcTemplate
- **Location**: `users/infra/persistence/JdbcUserRepository.java` (substituir scaffold)
- **Interfaces**:
  - `save(User)` — INSERT/UPDATE user + roles + profiles (upsert via INSERT ON CONFLICT)
  - `findById(UserId)` — SELECT com JOINs para montar agregado completo
  - `findByEmail(Email)` — SELECT com JOINs por email
  - `findByCpf(Cpf)` — SELECT com JOINs por CPF
- **Dependencies**: `NamedParameterJdbcTemplate`, `UserEntityMapper`
- **Reuses**: Domain interfaces e value objects existentes

### UserEntityMapper (Persistence — rewrite)

- **Purpose**: Converter ResultSet → User domain aggregate (hidratar agregado completo com roles e profiles)
- **Location**: `users/infra/persistence/UserEntityMapper.java`
- **Interfaces**:
  - `User mapRow(ResultSet rs)` — monta User a partir de resultado do JOIN
  - `User mapAggregate(List<Map<String, Object>> rows)` — agrupa multiplas linhas (por causa do JOIN com roles) em um unico User
- **Dependencies**: Value objects (Email, Cpf, UserId, UserName, PasswordHash)
- **Reuses**: Factory methods dos VOs (`Email.of()`, etc.)
- **Nota**: Precisa de um metodo de reconstrucao no User (ver Data Models abaixo)

### UserRegisteredEvent (Domain Event)

- **Purpose**: Evento publicado apos registro bem-sucedido
- **Location**: `users/domain/UserRegisteredEvent.java`
- **Definition**:
  ```java
  public record UserRegisteredEvent(
      UUID userId,
      String email,
      String name,
      Instant timestamp
  ) {}
  ```
- **Dependencies**: Nenhuma — record puro

### SecurityConfig (Infra — novo)

- **Purpose**: Configurar Spring Security com filtro JWT
- **Location**: `users/infra/config/SecurityConfig.java` (ou nivel de aplicacao)
- **Interfaces**:
  - `SecurityFilterChain` bean com:
    - POST /api/users (registro) — publico
    - POST /api/auth/login — publico
    - PATCH /api/users/me/** — protegido (exige JWT valido)
    - POST /api/users/me/provider-profile — protegido
    - Default: deny
  - `JwtAuthenticationFilter` adicionado antes de `UsernamePasswordAuthenticationFilter`
- **Dependencies**: Spring Security, `JwtService`
- **Nota**: Detalhes do JWT (login, geracao, validacao) vivem na feature **Autenticacao JWT** — este design apenas expoe o ponto de integracao.

---

## Data Models

### Schema PostgreSQL (module: users)

```sql
CREATE SCHEMA IF NOT EXISTS users;

CREATE TABLE users.users (
    id            UUID PRIMARY KEY,
    email         VARCHAR(255) NOT NULL,
    cpf           VARCHAR(11)  NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    active        BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_cpf   UNIQUE (cpf)
);

CREATE TABLE users.user_roles (
    user_id UUID        NOT NULL REFERENCES users.users(id) ON DELETE CASCADE,
    role    VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, role)
);

CREATE TABLE users.client_profiles (
    user_id    UUID PRIMARY KEY REFERENCES users.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE users.provider_profiles (
    user_id      UUID PRIMARY KEY REFERENCES users.users(id) ON DELETE CASCADE,
    description  TEXT,
    rating       DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    review_count BIGINT       NOT NULL DEFAULT 0,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Hidratacao do agregado User (reconstrucao do banco)

O User tem construtor privado e factory method `registerUser()` para criacao. Para reconstrucao a partir do banco, precisamos de um metodo adicional:

```java
// Adicionar ao User.java — metodo package-private para reconstrucao
static User reconstitute(
    UserId id, Email email, Cpf cpf, PasswordHash passwordHash,
    UserName name, Instant createdAt, boolean active,
    Set<UserRole> roles, ClientProfile clientProfile,
    ProviderProfile providerProfile
) {
    User user = new User(id, email, cpf, passwordHash, name, createdAt);
    user.active = active;
    user.roles.addAll(roles);
    user.clientProfile = clientProfile;
    user.providerProfile = providerProfile;
    return user;
}
```

**Por que:** Separar criacao (registerUser — aplica regras de negocio) de reconstrucao (reconstitute — carrega estado existente sem validar). Padrao DDD classico.

**Visibilidade:** `package-private` — acessivel apenas dentro do pacote `domain`. O `UserEntityMapper` em `infra/persistence` precisara de acesso, entao o mapper recebera os dados brutos e delegara a reconstrucao via um port ou o metodo sera `public` por pragmatismo. Decisao: tornar `public` com Javadoc marcando uso exclusivo para persistencia.

---

## Error Handling Strategy

| Error Scenario | Domain Exception | HTTP Status | Response Body |
|---|---|---|---|
| Email duplicado | EmailAlreadyExistsException | 409 Conflict | `{"message": "Email already in use: x@y.com", "status": 409}` |
| CPF duplicado | CpfAlreadyExistsException | 409 Conflict | `{"message": "CPF already in use: 12345678901", "status": 409}` |
| Usuario nao encontrado | UserNotFoundException | 404 Not Found | `{"message": "User not found with id: ...", "status": 404}` |
| Senha atual incorreta | InvalidPasswordException | 422 Unprocessable Entity | `{"message": "Current password is incorrect", "status": 422}` |
| Usuario desativado | InactiveUserException | 403 Forbidden | `{"message": "User is inactive and cannot perform this operation", "status": 403}` |
| Perfil duplicado | IllegalStateException | 409 Conflict | `{"message": "...", "status": 409}` |
| Validacao VO (email, cpf, nome) | IllegalArgumentException | 400 Bad Request | `{"message": "...", "status": 400}` |
| Bean Validation (@NotBlank) | MethodArgumentNotValidException | 400 Bad Request | `{"message": "Validation failed: ...", "status": 400}` |

---

## Tech Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Persistencia | NamedParameterJdbcTemplate | Dominio nao pode ter anotacoes Spring; JdbcTemplate da controle total sobre hidratacao do agregado |
| Schema DB | PostgreSQL schema `users` por modulo | Regra de arquitetura: "Each Module has its own scheme for isolating tables" |
| Reconstrucao do agregado | Metodo `User.reconstitute()` | Separar criacao (regras de negocio) de reconstrucao (carregar estado) — padrao DDD |
| Error handling | @RestControllerAdvice por modulo | Cada modulo controla seu mapeamento de erros sem interferir em outros |
| Save strategy | INSERT + ON CONFLICT UPDATE | User eh sempre salvo como agregado completo — simplifica logica vs. tracking dirty fields |
| Security | SecurityFilterChain minima | Permitir registro sem auth; config completa em feature futura |
| Eventos | Records no domain, publicados via ApplicationEventPublisher | Spring Modulith persiste transacionalmente via spring-modulith-starter-jdbc |
| Search path DB | `spring.datasource.hikari.schema=users` ou SET search_path | Garantir que queries sem schema prefix funcionem dentro do modulo |

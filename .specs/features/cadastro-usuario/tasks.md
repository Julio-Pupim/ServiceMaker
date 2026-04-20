# M1 Fundacao (Users + Auth) — Tasks

**Design**: `cadastro-usuario/design.md`, `perfil-prestador/design.md`, `desativacao-usuario/design.md`
**Status**: Complete
**Scope**: Cobre as 4 features do M1 (cadastro, perfil prestador, desativacao, autenticacao JWT) por compartilharem o mesmo agregado, persistencia e API.
**Total tasks**: 11 (T1–T11)

---

## Execution Plan

### Phase 1: Foundation (Parallel)

Sem dependencias entre si. Base para tudo que vem depois.

```
T1 [P] (migration)
T2 [P] (reconstitute)
T3 [P] (domain events + invariantes + InactiveUserException)
```

### Phase 2: Persistence (Sequential)

Mapper depende do reconstitute, repository depende de migration + mapper.

```
T2 ──→ T4 (mapper) ──→ T5 (repository + integration tests)
T1 ────────────────────┘
```

### Phase 3: Application + API Prep + Auth (Parallel)

Modificacoes nos use cases, camada API e autenticacao JWT. Podem rodar em paralelo.

```
T3 ──→ T6 [P] (use cases + events)
       T7 [P] (API DTOs)
T3 ──→ T8 [P] (exception handler)
T3, T5 ──→ T11 [P] (JWT auth: login + JwtService + filter)
```

### Phase 4: API Integration (Sequential)

Controller integra tudo. SecurityConfig fecha com JWT filter.

```
T5, T6, T7, T8, T11 ──→ T9 (controller com /me endpoints + tests) ──→ T10 (security config + JWT filter)
```

---

## Task Breakdown

### T1: Liquibase migration — schema users + 4 tabelas [P]

**What**: Criar migration Liquibase que cria o schema `users` e as tabelas `users`, `user_roles`, `client_profiles`, `provider_profiles` com constraints.
**Where**: `src/main/resources/db/changelog/` (novo changeset no master ou arquivo separado incluido)
**Depends on**: None
**Reuses**: `db.changelog-master.xml` existente
**Requirement**: REG-08

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Schema `users` criado no PostgreSQL
- [ ] Tabela `users.users` com PK uuid, UNIQUE email, UNIQUE cpf, password_hash, name, created_at, active
- [ ] Tabela `users.user_roles` com PK composta (user_id, role), FK para users
- [ ] Tabela `users.client_profiles` com PK user_id, FK para users, created_at
- [ ] Tabela `users.provider_profiles` com PK user_id, FK para users, description, rating, review_count, created_at
- [ ] ON DELETE CASCADE em todas as FKs
- [ ] Gate check passes: `./mvnw compile`

**Tests**: none (migration validada pelo Liquibase no boot + integration tests em T5)
**Gate**: build

**Commit**: `feat(users): add liquibase migration for users module schema`

---

### T2: User.reconstitute() — metodo de reconstrucao do agregado [P]

**What**: Adicionar metodo estatico `reconstitute()` ao User para hidratar agregado a partir do banco, separando criacao (registerUser) de reconstrucao. Adicionar unit test.
**Where**: `src/main/java/br/com/serviceMaker/users/domain/User.java`, `src/test/java/br/com/serviceMaker/users/domain/UserTest.java`
**Depends on**: None
**Reuses**: User.java existente, UserTest.java existente
**Requirement**: REG-06, REG-07

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Metodo `public static User reconstitute(UserId, Email, Cpf, PasswordHash, UserName, Instant, boolean, Set<UserRole>, ClientProfile, ProviderProfile)` existe
- [ ] Reconstrucao nao aplica regras de negocio (nao valida, nao gera ID, nao adiciona role automaticamente)
- [ ] ClientProfile e ProviderProfile precisam ter visibilidade adequada (package-private → public constructor ou factory)
- [ ] Unit test: `should_reconstitute_user_from_persistence_data` — verifica todos os campos
- [ ] Unit test: `should_reconstitute_user_with_provider_profile` — verifica reconstrucao com perfil
- [ ] Gate check passes: `./mvnw test -Dtest=UserTest`
- [ ] Test count: 9+ tests pass (7 existentes + 2 novos)

**Tests**: unit (pure)
**Gate**: quick

**Commit**: `feat(users): add User.reconstitute() for aggregate hydration from persistence`

---

### T3: Domain events + InactiveUserException + invariantes do agregado [P]

**What**: Criar 4 event records, `InactiveUserException` e tornar `active=true` invariante explicito do agregado User. Adicionar guarda em `User.createProviderProfile()` **E** `User.changePassword()` (ambas mutacoes — invariante centralizado no dominio). Unit tests para ambas as guardas.
**Where**:
- `src/main/java/br/com/serviceMaker/users/domain/UserRegisteredEvent.java` (novo)
- `src/main/java/br/com/serviceMaker/users/domain/ProviderProfileCreatedEvent.java` (novo)
- `src/main/java/br/com/serviceMaker/users/domain/UserDeactivatedEvent.java` (novo)
- `src/main/java/br/com/serviceMaker/users/domain/PasswordChangedEvent.java` (novo)
- `src/main/java/br/com/serviceMaker/users/domain/exceptions/InactiveUserException.java` (novo — **compartilhada**, nao vive em pacote de feature)
- `src/main/java/br/com/serviceMaker/users/domain/User.java` (modificar `createProviderProfile` **e** `changePassword` — guardas de invariante `active=true`)
- `src/test/java/br/com/serviceMaker/users/domain/UserTest.java` (adicionar testes de invariante)
**Depends on**: None
**Reuses**: Padrao de domain exceptions existente, User.java
**Requirement**: REG-11, PROV-07, DEAC-10, DEAC-11

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `UserRegisteredEvent(UUID userId, String email, String name, Instant timestamp)` record criado
- [ ] `ProviderProfileCreatedEvent(UUID userId, String description, Instant timestamp)` record criado
- [ ] `UserDeactivatedEvent(UUID userId, Instant timestamp)` record criado
- [ ] `PasswordChangedEvent(UUID userId, Instant timestamp)` record criado
- [ ] `InactiveUserException` extends RuntimeException com mensagem descritiva, em `users/domain/exceptions/`
- [ ] `User.createProviderProfile()` lanca `InactiveUserException` se `!active` (invariante)
- [ ] `User.changePassword()` lanca `InactiveUserException` se `!active` (invariante)
- [ ] `User.deactivate()` permanece idempotente (nao valida `active`)
- [ ] Javadoc em User documentando os invariantes (email, cpf, nome validos; senha sempre hash; `active=true` pre-condicao de mutacao; perfil de prestador unico)
- [ ] Unit test: `should_not_allow_inactive_user_to_create_provider_profile`
- [ ] Unit test: `should_not_allow_inactive_user_to_change_password`
- [ ] Unit test: `should_allow_deactivation_on_inactive_user_idempotently`
- [ ] Gate check passes: `./mvnw test -Dtest=UserTest`
- [ ] Test count: 10+ tests pass (7 existentes + 3 novos)

**Tests**: unit (pure)
**Gate**: quick

**Commit**: `feat(users): enforce active invariant in User aggregate, add domain events and InactiveUserException`

---

### T4: UserEntityMapper — converter ResultSet para User aggregate

**What**: Implementar UserEntityMapper que converte resultado de query SQL (com JOINs) para o agregado User completo, usando User.reconstitute().
**Where**: `src/main/java/br/com/serviceMaker/users/infra/persistence/UserEntityMapper.java` (reescrever scaffold)
**Depends on**: T2 (User.reconstitute)
**Reuses**: Value objects (Email.of, Cpf.of, etc.), User.reconstitute()
**Requirement**: REG-06, REG-07

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] Metodo `User mapAggregate(List<Map<String, Object>> rows)` implementado
- [x] Agrupa multiplas linhas de resultado (JOINs com roles) em um unico User
- [x] Extrai roles do campo `role` e monta Set<UserRole>
- [x] Extrai ProviderProfile dos campos `provider_*` (nullable — pode ser null)
- [x] Extrai ClientProfile dos campos `client_*`
- [x] Trata corretamente UUID ↔ UserId, String ↔ Email/Cpf/UserName/PasswordHash
- [x] Gate check passes: `./mvnw compile`

**Tests**: none (testado indiretamente via integration test em T5 — mapper e repository sao testados juntos pois mapper sozinho nao tem como ser testado sem ResultSet real)
**Gate**: build

**Commit**: `feat(users): implement UserEntityMapper for aggregate hydration`

---

### T5: JdbcUserRepository — implementacao completa + integration tests

**What**: Implementar JdbcUserRepository com NamedParameterJdbcTemplate. Save (INSERT/UPDATE agregado completo), findById, findByEmail, findByCpf com JOINs. Criar integration tests com Testcontainers.
**Where**:
- `src/main/java/br/com/serviceMaker/users/infra/persistence/JdbcUserRepository.java` (reescrever scaffold)
- `src/test/java/br/com/serviceMaker/users/infra/persistence/JdbcUserRepositoryTest.java` (novo)
**Depends on**: T1 (migration — tabelas precisam existir), T4 (mapper)
**Reuses**: UserEntityMapper (T4), NamedParameterJdbcTemplate (Spring), DatabaseConnectionTest como referencia de Testcontainers setup
**Requirement**: REG-06, REG-07, PROV-04, DEAC-06

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `save(User)` faz INSERT ou UPDATE no users.users + DELETE/INSERT em user_roles + UPSERT em profiles
- [x] `findById(UserId)` retorna Optional<User> com agregado completo (roles + profiles) via JOIN
- [x] `findByEmail(Email)` retorna Optional<User> com agregado completo
- [x] `findByCpf(Cpf)` retorna Optional<User> com agregado completo
- [x] Retorna Optional.empty() quando nao encontra
- [x] Integration test: `should_save_and_find_user_by_id`
- [x] Integration test: `should_find_user_by_email`
- [x] Integration test: `should_find_user_by_cpf`
- [x] Integration test: `should_return_empty_when_not_found`
- [x] Integration test: `should_save_user_with_provider_profile`
- [x] Integration test: `should_update_existing_user` (ex: deactivate + save + find)
- [x] Gate check passes: `./mvnw test` (37 tests, 0 failures)
- [x] Test count: todos os testes existentes + 6 novos integration tests passam

**Tests**: integration (Testcontainers PostgreSQL)
**Gate**: full

**Commit**: `feat(users): implement JdbcUserRepository with full aggregate persistence`

---

### T6: Modificar use cases — event publishing [P]

**What**: Adicionar `ApplicationEventPublisher` aos 4 use cases. Publicar eventos apos operacoes bem-sucedidas. **NAO** duplicar guarda de `active` nos use cases — a guarda vive no dominio (T3). Atualizar unit tests.
**Where**:
- `src/main/java/br/com/serviceMaker/users/application/RegisterUserUseCase.java` (modificar)
- `src/main/java/br/com/serviceMaker/users/application/CreateProviderProfileUseCase.java` (modificar)
- `src/main/java/br/com/serviceMaker/users/application/DeactivateUserUseCase.java` (modificar)
- `src/main/java/br/com/serviceMaker/users/application/ChangePasswordUseCase.java` (modificar — se houver guarda de `active` local, **remover**; delegar ao dominio)
- `src/test/java/br/com/serviceMaker/users/application/*Test.java` (atualizar 4 test classes)
**Depends on**: T3 (domain events + InactiveUserException + invariantes no dominio)
**Reuses**: Use cases existentes, ApplicationEventPublisher (Spring)
**Requirement**: REG-11, PROV-07, DEAC-10, DEAC-11

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] RegisterUserUseCase publica UserRegisteredEvent apos save
- [x] CreateProviderProfileUseCase publica ProviderProfileCreatedEvent apos save (guarda de `active` vive em `User.createProviderProfile()` — use case nao duplica)
- [x] DeactivateUserUseCase publica UserDeactivatedEvent apenas se usuario estava ativo antes (verifica `wasActive` antes de chamar `user.deactivate()`)
- [x] ChangePasswordUseCase publica PasswordChangedEvent apos save (guarda de `active` vive em `User.changePassword()` — use case nao duplica)
- [x] Use cases NAO tem `if (!user.isActive()) throw ...` — invariante vive no agregado
- [x] Test: `should_publish_UserRegisteredEvent_after_registration`
- [x] Test: `should_publish_ProviderProfileCreatedEvent_after_profile_creation`
- [x] Test: `should_publish_UserDeactivatedEvent_when_user_was_active`
- [x] Test: `should_not_publish_event_when_user_already_inactive`
- [x] Test: `should_publish_PasswordChangedEvent_after_password_change`
- [x] Test: `should_propagate_InactiveUserException_from_domain_when_changing_password_for_inactive_user` (verifica que use case NAO valida, dominio lanca)
- [x] Gate check passes: `./mvnw test`
- [x] Test count: testes existentes (5+4+3+4=16) + 5 novos = 21 tests de use case passam (51 total)

**Tests**: unit (mocked — @ExtendWith(MockitoExtension.class))
**Gate**: quick

**Commit**: `feat(users): add domain event publishing to use cases (guards delegated to domain)`

---

### T7: API DTOs — request/response records [P]

**What**: Criar records para request/response da API REST com anotacoes Bean Validation.
**Where**:
- `src/main/java/br/com/serviceMaker/users/api/RegisterUserRequest.java` (novo)
- `src/main/java/br/com/serviceMaker/users/api/UserIdResponse.java` (novo)
- `src/main/java/br/com/serviceMaker/users/api/CreateProviderProfileRequest.java` (novo)
- `src/main/java/br/com/serviceMaker/users/api/ChangePasswordRequest.java` (novo)
- `src/main/java/br/com/serviceMaker/users/api/ErrorResponse.java` (novo)
**Depends on**: None
**Reuses**: Nenhum — records puros
**Requirement**: REG-09, PROV-05, DEAC-07, DEAC-08

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] RegisterUserRequest com @NotBlank em email, cpf, password, name
- [x] UserIdResponse(UUID id) criado
- [x] CreateProviderProfileRequest com @NotBlank em description
- [x] ChangePasswordRequest com @NotBlank em currentPassword, newPassword
- [x] ErrorResponse(String message, int status) criado
- [x] Gate check passes: `./mvnw compile`

**Tests**: none (records sem logica — validados via controller tests em T9)
**Gate**: build

**Commit**: `feat(users): add API request/response DTOs with bean validation`

---

### T8: UserExceptionHandler — mapeamento de exceptions para HTTP [P]

**What**: Criar @RestControllerAdvice que mapeia domain exceptions para respostas HTTP com ErrorResponse.
**Where**: `src/main/java/br/com/serviceMaker/users/api/UserExceptionHandler.java` (novo)
**Depends on**: T3 (InactiveUserException)
**Reuses**: Domain exceptions existentes (EmailAlreadyExistsException, CpfAlreadyExistsException, UserNotFoundException, InvalidPasswordException), ErrorResponse (T7 — mas sem dependencia de compilacao, apenas usa o record)
**Requirement**: REG-10, PROV-06, DEAC-09

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `@RestControllerAdvice(basePackages = "br.com.serviceMaker.users.api")`
- [x] EmailAlreadyExistsException → 409 Conflict + ErrorResponse
- [x] CpfAlreadyExistsException → 409 Conflict + ErrorResponse
- [x] UserNotFoundException → 404 Not Found + ErrorResponse
- [x] InvalidPasswordException → **422 Unprocessable Entity** + ErrorResponse (JWT ja autenticou — senha errada eh entrada semanticamente invalida)
- [x] InactiveUserException → 403 Forbidden + ErrorResponse
- [x] IllegalStateException → 409 Conflict + ErrorResponse
- [x] IllegalArgumentException → 400 Bad Request + ErrorResponse
- [x] MethodArgumentNotValidException → 400 Bad Request + ErrorResponse (com detalhes dos campos)
- [x] Gate check passes: `./mvnw compile`

**Tests**: none (testado via controller integration tests em T9)
**Gate**: build

**Commit**: `feat(users): add UserExceptionHandler for HTTP error mapping`

---

### T9: UserController — 4 endpoints + integration tests

**What**: Implementar UserController com os 4 endpoints REST. Endpoints protegidos usam `@AuthenticationPrincipal UserId` — userId NUNCA vem do path. Criar integration tests com @SpringBootTest + Testcontainers, autenticando via JWT gerado (depende de T11).
**Where**:
- `src/main/java/br/com/serviceMaker/users/api/UserController.java` (reescrever scaffold)
- `src/test/java/br/com/serviceMaker/users/api/UserControllerTest.java` (novo)
**Depends on**: T5 (repository funcional), T6 (use cases com eventos), T7 (DTOs), T8 (exception handler), T11 (JWT auth — necessario para testar rotas protegidas)
**Reuses**: Use cases existentes, DTOs (T7), exception handler (T8), `JwtService` (T11)
**Requirement**: REG-09, REG-10, PROV-05, PROV-06, DEAC-07, DEAC-08, DEAC-09

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `POST /api/users` → 201 Created com UserIdResponse (publico — sem JWT)
- [x] `POST /api/users/me/provider-profile` → 201 Created — `@AuthenticationPrincipal UserId` (protegido)
- [x] `PATCH /api/users/me/password` → 204 No Content — `@AuthenticationPrincipal UserId` (protegido)
- [x] `PATCH /api/users/me/deactivate` → 204 No Content — `@AuthenticationPrincipal UserId` (protegido)
- [x] @Valid em todos os request bodies
- [x] Endpoints `/me/*` NAO tem `{userId}` no path — userId vem exclusivamente do JWT
- [x] Test: `should_register_user_and_return_201`
- [x] Test: `should_return_409_when_email_already_exists`
- [x] Test: `should_return_400_when_request_body_invalid`
- [x] Test: `should_return_401_when_no_jwt_on_protected_endpoint`
- [x] Test: `should_create_provider_profile_and_return_201` (com JWT)
- [x] Test: `should_return_403_when_user_is_inactive`
- [x] Test: `should_change_password_and_return_204` (com JWT)
- [x] Test: `should_return_422_when_current_password_wrong`
- [x] Test: `should_deactivate_user_and_return_204` (com JWT)
- [x] Gate check passes: `./mvnw test` (60 tests, 0 failures)
- [x] Test count: todos os testes existentes + 9 novos controller tests passam

**Tests**: integration (Testcontainers — @SpringBootTest com TestRestTemplate + JWT gerado via `JwtService` nos testes)
**Gate**: full

**Commit**: `feat(users): implement UserController with JWT-protected /me endpoints`

---

### T10: SecurityConfig — Spring Security + integracao JWT filter

**What**: Criar `SecurityFilterChain` com rotas publicas (POST /api/users, POST /api/auth/login) e protegidas (/api/users/me/**, POST /api/users/me/provider-profile). Adicionar `JwtAuthenticationFilter` antes do `UsernamePasswordAuthenticationFilter`.
**Where**: `src/main/java/br/com/serviceMaker/users/infra/config/SecurityConfig.java` (reescrever scaffold)
**Depends on**: T9 (controller), T11 (JwtAuthenticationFilter, JwtService)
**Reuses**: `JwtAuthenticationFilter` (T11)
**Requirement**: REG-09 (registro publico), DEAC-07..09 (endpoints protegidos exigem JWT)

**Tools**:
- MCP: context7 (verificar API Spring Security 6.x)
- Skill: NONE

**Done when**:
- [x] SecurityFilterChain bean configurado (implemented with T11)
- [x] POST /api/users permitido sem autenticacao
- [x] POST /api/auth/login permitido sem autenticacao
- [x] /api/users/me/** exige JWT valido (401 Unauthorized se ausente/invalido)
- [x] Demais endpoints: default deny (anyRequest().authenticated())
- [x] `JwtAuthenticationFilter` adicionado via `.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)`
- [x] CSRF desabilitado para API REST (stateless)
- [x] SessionCreationPolicy.STATELESS
- [x] Gate check passes: `./mvnw test` (51 tests, 0 failures)
- [x] Todos os testes de T9 continuam passando (60 tests, 0 failures)

**Tests**: none (validado pelos testes de T9 rodando com security + JWT ativos)
**Gate**: full

**Commit**: `feat(users): add Spring Security config with JWT filter integration`

---

### T11: Autenticacao JWT — login endpoint + JwtService + filter

**What**: Implementar autenticacao JWT. Endpoint `POST /api/auth/login` (recebe email + senha, retorna access token). `JwtService` (gerar, validar, extrair `UserId` do token). `JwtAuthenticationFilter` que le `Authorization: Bearer <token>`, valida, e popula `SecurityContext` com `UserId` como principal. Integration tests.
**Where**:
- `src/main/java/br/com/serviceMaker/users/api/AuthController.java` (novo)
- `src/main/java/br/com/serviceMaker/users/api/LoginRequest.java` (novo) — `@NotBlank String email, @NotBlank String password`
- `src/main/java/br/com/serviceMaker/users/api/LoginResponse.java` (novo) — `String accessToken, long expiresInSeconds`
- `src/main/java/br/com/serviceMaker/users/application/AuthenticateUserUseCase.java` (novo)
- `src/main/java/br/com/serviceMaker/users/application/command/LoginCommand.java` (novo)
- `src/main/java/br/com/serviceMaker/users/infra/security/JwtService.java` (novo) — gera e valida tokens
- `src/main/java/br/com/serviceMaker/users/infra/security/JwtAuthenticationFilter.java` (novo) — OncePerRequestFilter
- `src/main/resources/application.properties` (adicionar `app.jwt.secret`, `app.jwt.expiration-seconds`)
- `src/test/java/br/com/serviceMaker/users/infra/security/JwtServiceTest.java` (novo)
- `src/test/java/br/com/serviceMaker/users/api/AuthControllerTest.java` (novo)
**Depends on**: T5 (repository), T3 (InactiveUserException — login de user desativado retorna 403)
**Reuses**: `UserRepository`, `PasswordHasher`, `InactiveUserException`
**Requirement**: Feature "Autenticacao JWT" do M1 (habilita rotas protegidas das outras features)

**Tools**:
- MCP: context7 (consultar `io.jsonwebtoken:jjwt` 0.12.x ou `spring-security-oauth2-resource-server`)
- Skill: NONE

**Done when**:
- [x] `POST /api/auth/login` com email + senha retorna 200 + `{ "accessToken": "...", "expiresInSeconds": 3600 }`
- [x] Login com email inexistente → 401 Unauthorized
- [x] Login com senha errada → 401 Unauthorized
- [x] Login com usuario desativado → 403 Forbidden
- [x] `JwtService.generateToken(UserId)` retorna JWT com `sub` = userId, `iat`, `exp`
- [x] `JwtService.extractUserId(String token)` retorna `UserId` ou lanca exception se token invalido/expirado
- [x] `JwtAuthenticationFilter` extrai token do header `Authorization: Bearer ...`, valida, e popula SecurityContext com `UserId` como principal
- [x] Request com token expirado → 401 Unauthorized (handled by filter — continues without auth)
- [x] Request com token malformado → 401 Unauthorized (handled by filter — continues without auth)
- [x] Segredo JWT vem de `application.yaml` (nao hardcoded)
- [x] Test: `should_generate_valid_token_for_user_id`
- [x] Test: `should_extract_user_id_from_valid_token`
- [x] Test: `should_reject_expired_token`
- [x] Test: `should_reject_malformed_token`
- [x] Test: `should_login_and_return_access_token`
- [x] Test: `should_return_401_on_wrong_password`
- [x] Test: `should_return_403_on_inactive_user_login`
- [x] Test: `should_return_401_on_unknown_email` (bonus)
- [x] Gate check passes: `./mvnw test` (51 tests, 0 failures)
- [x] Test count: todos os testes existentes + 8 novos tests passam

**Tests**: unit (JwtService puro) + integration (@SpringBootTest + Testcontainers + TestRestTemplate para AuthController)
**Gate**: full

**Commit**: `feat(users): add JWT authentication (login endpoint, JwtService, filter)`

---

## Parallel Execution Map

```
Phase 1 (Parallel):
  ├── T1 [P] (migration)
  ├── T2 [P] (reconstitute)
  └── T3 [P] (events + invariantes + InactiveUserException)

Phase 2 (Sequential):
  T2 ──→ T4 (mapper)
  T1, T4 ──→ T5 (repository + integration tests)

Phase 3 (Parallel):
  ├── T6 [P] (use cases + events)     ← depends T3
  ├── T7 [P] (API DTOs)               ← no deps
  ├── T8 [P] (exception handler)      ← depends T3
  └── T11 [P] (JWT auth)              ← depends T3, T5

Phase 4 (Sequential):
  T5, T6, T7, T8, T11 ──→ T9 (controller com /me + tests)
  T9 ──→ T10 (security config + JWT filter)
```

---

## Task Granularity Check

| Task | Scope | Status |
|---|---|---|
| T1: Liquibase migration | 1 migration file (4 tabelas cohesivas) | ✅ Granular |
| T2: User.reconstitute() | 1 metodo + tests no mesmo arquivo | ✅ Granular |
| T3: Events + exception | 5 record/class files (triviais, 3-5 linhas cada) + 1 guard | ⚠️ OK — cohesivos, todos domain additions |
| T4: UserEntityMapper | 1 classe | ✅ Granular |
| T5: JdbcUserRepository | 1 implementacao + 1 test class | ✅ Granular (test co-located) |
| T6: Modify use cases | 4 use cases (mesmo padrao) + 4 test classes | ⚠️ OK — mesmo padrao aplicado, cohesivo |
| T7: API DTOs | 5 records (triviais, sem logica) | ⚠️ OK — cohesivos, todos API records |
| T8: UserExceptionHandler | 1 classe | ✅ Granular |
| T9: UserController | 1 classe (4 metodos) + 1 test class | ✅ Granular (test co-located) |
| T10: SecurityConfig | 1 classe | ✅ Granular |
| T11: JWT Auth | 7 files (controller, use case, JwtService, filter, DTOs, tests) | ⚠️ OK — cohesivos, todos relacionados a autenticacao JWT |

---

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagram Shows | Status |
|---|---|---|---|
| T1 | None | No incoming arrows | ✅ Match |
| T2 | None | No incoming arrows | ✅ Match |
| T3 | None | No incoming arrows | ✅ Match |
| T4 | T2 | T2 → T4 | ✅ Match |
| T5 | T1, T4 | T1, T4 → T5 | ✅ Match |
| T6 | T3 | T3 → T6 | ✅ Match |
| T7 | None | No incoming arrows | ✅ Match |
| T8 | T3 | T3 → T8 | ✅ Match |
| T9 | T5, T6, T7, T8, T11 | T5, T6, T7, T8, T11 → T9 | ✅ Match |
| T10 | T9, T11 | T9, T11 → T10 | ✅ Match |
| T11 | T3, T5 | T3, T5 → T11 | ✅ Match |

---

## Test Co-location Validation

| Task | Code Layer | Matrix Requires | Task Says | Status |
|---|---|---|---|---|
| T1: Migration | DB migration | none | none | ✅ OK |
| T2: reconstitute | Domain entity | unit (pure) | unit | ✅ OK |
| T3: Events + exception | Domain entity + exception | unit (pure) | unit | ✅ OK |
| T4: Mapper | Infra/persistence helper | none (new layer) | none | ✅ OK |
| T5: Repository | Repository impl | integration (Testcontainers) | integration | ✅ OK |
| T6: Use cases | Application (use cases) | unit (mocked) | unit | ✅ OK |
| T7: DTOs | API records | none (no logic) | none | ✅ OK |
| T8: Exception handler | API handler | none (new, no logic complex) | none | ✅ OK |
| T9: Controller | API controller | integration* | integration | ✅ OK |
| T10: Security config | Infra config | none | none (validated by T9 re-run) | ✅ OK |
| T11: JWT Auth | Mix (app, infra/security, api) | unit + integration | unit + integration | ✅ OK |

*Controller tests nao estavam definidos no TESTING.md original (controllers nao existiam). Definido como integration (@SpringBootTest + Testcontainers) para validar stack completa.

---

## Requirement Coverage

| Requirement | Task(s) | Status |
|---|---|---|
| REG-01..05 (registro, unicidade, hash, validacao) | Ja implementados (dominio + use case) | ✅ Existing |
| REG-06, REG-07 (persistencia, busca) | T2, T4, T5 | Mapped |
| REG-08 (migration) | T1 | Mapped |
| REG-09, REG-10 (API REST, error handling) | T7, T8, T9 | Mapped |
| REG-11 (UserRegisteredEvent) | T3, T6 | Mapped |
| PROV-01..03 (perfil prestador, guarda, role) | Ja implementados | ✅ Existing |
| PROV-04 (persistencia perfil) | T5 | Mapped |
| PROV-05, PROV-06 (API, errors) | T7, T8, T9 | Mapped |
| PROV-07 (ProviderProfileCreatedEvent) | T3, T6 | Mapped |
| DEAC-01..05 (desativacao, senha, validacao) | Ja implementados | ✅ Existing |
| DEAC-06 (persistencia) | T5 | Mapped |
| DEAC-07..09 (APIs, errors) | T7, T8, T9 | Mapped |
| DEAC-10, DEAC-11 (eventos) | T3, T6 | Mapped |
| AUTH (login JWT, JwtService, filter) | T11 | Mapped |
| Invariantes do agregado (active) | T3 (dominio) | Mapped |
| Endpoints /me/* com @AuthenticationPrincipal | T9 + T10 + T11 | Mapped |

**Coverage:** 29 requirements + Auth feature + Invariantes, todos mapeados ✅

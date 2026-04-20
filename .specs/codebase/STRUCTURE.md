# Project Structure

**Root:** serviceMaker (Maven project)

## Directory Tree

```
serviceMaker/
├── pom.xml
├── mvnw / mvnw.cmd
├── CLAUDE.md                             — Agent directives (start here)
├── Eventos.md                            — Domain event catalog
├── Estados.md                            — State machine definitions
├── src/
│   ├── main/
│   │   ├── java/br/com/serviceMaker/
│   │   │   ├── ServiceMakerApplication.java
│   │   │   ├── shared/                   — Shared kernel (cross-module VOs)
│   │   │   ├── users/                    — User management (active)
│   │   │   ├── services/                 — Service catalog (scaffold)
│   │   │   ├── scheduling/               — Appointments (scaffold)
│   │   │   ├── payments/                 — Payments (scaffold)
│   │   │   ├── reviews/                  — Reviews (scaffold)
│   │   │   ├── categories/               — Categories (scaffold)
│   │   │   └── search/                   — Search/matching (scaffold)
│   │   └── resources/
│   │       ├── application.yaml
│   │       └── db/changelog/             — Liquibase migrations (per-module subdirs)
│   │           ├── db.changelog-master.xml
│   │           └── users/                — Users module migrations
│   └── test/
│       └── java/br/com/serviceMaker/
│           ├── ServiceMakerApplicationTests.java
│           ├── DatabaseConnectionTest.java
│           ├── ArchitectureTest.java      — ArchUnit + Modulith boundary tests
│           └── users/                     — User module tests
└── .specs/                                — Spec-driven docs (this directory)
    ├── codebase/
    │   ├── ARCHITECTURE.md
    │   ├── CONVENTIONS.md
    │   ├── CONCERNS.md
    │   ├── GLOSSARY.md                    — Ubiquitous language (canonical domain terms)
    │   ├── INTEGRATIONS.md
    │   ├── STACK.md
    │   ├── STRUCTURE.md                   — This file
    │   └── TESTING.md
    ├── project/
    │   ├── ROADMAP.md
    │   └── STATE.md
    └── features/
        ├── cadastro-usuario/
        │   ├── spec.md
        │   ├── design.md
        │   └── tasks.md
        ├── perfil-prestador/
        │   ├── spec.md
        │   └── design.md
        └── desativacao-usuario/
            ├── spec.md
            └── design.md
```

## Module Organization

### shared (Shared Kernel)

**Purpose:** Cross-module value objects used by multiple modules
**Location:** `src/main/java/br/com/serviceMaker/shared/`
**Key files:** `UserId.java`, `Email.java`, `Cpf.java`, `UserName.java`
**Note:** Will be renamed to `UsuarioId.java`, `NomeUsuario.java` etc. as part of AD-002 migration (see STATE.md)

### users (Active Module)

**Purpose:** User registration, authentication, profile management
**Location:** `src/main/java/br/com/serviceMaker/users/`
**Key files:**
- Domain: `User.java` (aggregate root), `UserRepository.java`, `PasswordHasher.java`, `UserRole.java`
- Application: `RegisterUserUseCase.java`, `ChangePasswordUseCase.java`, `CreateProviderProfileUseCase.java`, `DeactivateUserUseCase.java`
- Infra: `JdbcUserRepository.java`, `BCryptPasswordHasher.java`
**Note:** Domain class names will migrate to Portuguese per GLOSSARY.md during Phase 2+

### Scaffold Modules (empty packages)

**Purpose:** Placeholder packages for future modules
**Modules:** services, scheduling, payments, reviews, categories, search
**Note:** `requests` and `proposals` modules are deferred to v2 (AD-001)

## Where Things Live

**User Management:**
- API: `users/api/UserController.java` (empty)
- Business Logic: `users/domain/User.java`
- Data Access: `users/infra/persistence/JdbcUserRepository.java`
- Configuration: `users/infra/config/UsersConfig.java` (empty)

**Database Migrations:**
- Location: `src/main/resources/db/changelog/users/` (module-specific)
- Master: `db.changelog-master.xml` (root, includes module masters)

## Special Directories

**shared/:** Shared kernel — only cross-module value objects. No services, no repositories.
**{module}/domain/exceptions/:** Module-specific domain exceptions (not in shared).
**{module}/application/command/:** Input DTOs for use cases (Java records).
**.specs/:** All project documentation — architecture, conventions, feature specs, tasks.

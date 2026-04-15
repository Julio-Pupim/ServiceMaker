# Project Structure

**Root:** serviceMaker (Maven project)

## Directory Tree

```
serviceMaker/
├── pom.xml
├── mvnw / mvnw.cmd
├── CLAUDE.md
├── Eventos.md                    — Domain event catalog
├── Estados.md                    — State machine definitions
├── src/
│   ├── main/
│   │   ├── java/br/com/serviceMaker/
│   │   │   ├── ServiceMakerApplication.java
│   │   │   ├── shared/           — Shared kernel (cross-module VOs)
│   │   │   ├── users/            — User management (active)
│   │   │   ├── services/         — Service catalog (scaffold)
│   │   │   ├── requests/         — Service requests (scaffold)
│   │   │   ├── proposals/        — Proposals (scaffold)
│   │   │   ├── scheduling/       — Appointments (scaffold)
│   │   │   ├── payments/         — Payments (scaffold)
│   │   │   ├── reviews/          — Reviews (scaffold)
│   │   │   ├── categories/       — Categories (scaffold)
│   │   │   └── search/           — Search/matching (scaffold)
│   │   └── resources/
│   │       ├── application.yaml
│   │       └── db/changelog/     — Liquibase migrations
│   └── test/
│       └── java/br/com/serviceMaker/
│           ├── ServiceMakerApplicationTests.java
│           ├── DatabaseConnectionTest.java
│           └── users/            — User module tests
└── .specs/                       — Spec-driven docs (this directory)
```

## Module Organization

### shared (Shared Kernel)

**Purpose:** Cross-module value objects used by multiple modules
**Location:** `src/main/java/br/com/serviceMaker/shared/`
**Key files:** `UserId.java`, `Email.java`, `Cpf.java`, `UserName.java`

### users (Active Module)

**Purpose:** User registration, authentication, profile management
**Location:** `src/main/java/br/com/serviceMaker/users/`
**Key files:**
- Domain: `User.java` (aggregate root), `UserRepository.java`, `PasswordHasher.java`, `UserRole.java`
- Application: `RegisterUserUseCase.java`, `ChangePasswordUseCase.java`, `CreateProviderProfileUseCase.java`, `DeactivateUserUseCase.java`
- Infra: `JdbcUserRepository.java`, `BCryptPasswordHasher.java`

### Scaffold Modules (empty packages)

**Purpose:** Placeholder packages for future modules
**Modules:** services, requests, proposals, scheduling, payments, reviews, categories, search

## Where Things Live

**User Management:**
- API: `users/api/UserController.java` (empty)
- Business Logic: `users/domain/User.java`
- Data Access: `users/infra/persistence/JdbcUserRepository.java`
- Configuration: `users/infra/config/UsersConfig.java` (empty)

**Database Migrations:**
- Location: `src/main/resources/db/changelog/`
- Master: `db.changelog-master.xml`

## Special Directories

**shared/:** Shared kernel — only cross-module value objects. No services, no repositories.
**{module}/domain/exceptions/:** Module-specific domain exceptions (not in shared).
**{module}/application/command/:** Input DTOs for use cases (Java records).

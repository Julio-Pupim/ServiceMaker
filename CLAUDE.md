# CLAUDE.md

## Rules
 

## Project Overview

**serviceMaker** — a services marketplace (ecommerce de serviços) where clients request services, providers submit proposals, and appointments are scheduled. Written in Portuguese (Brazilian) domain language.

## Build & Test Commands

```bash
./mvnw compile                          # compile
./mvnw test                             # run all tests
./mvnw test -Dtest=UserTest             # run a single test class
./mvnw test -Dtest=UserTest#testMethod  # run a single test method
./mvnw spring-boot:run                  # run the application
```

**Prerequisites:** Java 25, PostgreSQL on `localhost:5432/servicemaker` (user/pass: postgres/postgres). Tests use Testcontainers (Docker required).

## Tech Stack

- **Spring Boot 4.0.3** with Spring Modulith for modular monolith architecture
- **Spring Data JDBC** (not JPA) for persistence
- **Liquibase** for database migrations (`src/main/resources/db/changelog/`)
- **Spring Security** + **BCrypt** for authentication
- **Testcontainers** (PostgreSQL) for integration tests
- **Lombok** for boilerplate reduction
- **springdoc-openapi** for API docs

## Architecture

The project follows a **modular monolith** using Spring Modulith. Each module is a top-level package under `br.com.serviceMaker`.

### Module structure (using `users` as example)

```
users/
  api/            — REST controllers (inbound adapters)
  application/    — Use cases (application services), one class per use case
    command/      — Command records (input DTOs for use cases)
  domain/         — Aggregates, value objects, repository interfaces, domain exceptions
    vo/           — Value objects specific to this module
    exceptions/   — Domain-specific exceptions
  infra/
    persistence/  — Repository implementations (JDBC)
    security/     — Security infrastructure (e.g., BCryptPasswordHasher)
    config/       — Spring configuration for this module
```

### Key patterns

- **Rich domain model:** Business logic lives in domain entities (e.g., `User.registerUser()`, `User.createProviderProfile()`). Use cases orchestrate but don't contain business rules.
- **Command pattern:** Each use case receives a `*Command` record as input.
- **Domain interfaces for infra:** `UserRepository` and `PasswordHasher` are domain interfaces implemented in `infra/`.
- **Shared kernel:** `br.com.serviceMaker.shared` contains cross-module value objects (`UserId`, `Email`, `Cpf`, `UserName`).
- **Event-driven flow:** Modules communicate via domain events (see `Eventos.md` for the full event catalog and flow).

### Planned modules (from domain docs)

Users → Services → ServiceRequests → Proposals → Appointments → Payments → Reviews. The event flow: client creates request → matching finds providers → provider submits proposal → client accepts → appointment scheduled → service completed → review created.

# Agent Core Directives

You are an autonomous expert software engineer working on **serviceMaker**. Your primary goal is to write clean, modular, and test-driven code.

**NEVER guess the system architecture or conventions. Use the Routing Logic below to fetch the exact context you need.**

## 1. Global Directives (Always Active)

- **Domain Language:** The system domain is exclusively in Portuguese (Brazilian). Domain models, variables, business rules, exceptions, and events MUST be in Portuguese (e.g., `Usuario`, `PerfilPrestador`, `Agendamento`). Structural code (Services, Repositories, Controllers) uses English suffixes (e.g., `UsuarioRepository`, `RegisterUsuarioUseCase`). See `.specs/codebase/GLOSSARY.md` for the canonical ubiquitous language.
- **No Hallucinations:** If a requested task contradicts the `.specs/`, point out the discrepancy. Never invent architecture, patterns, or conventions not documented in the specs.
- **Blocker Check:** Before starting any task, check `.specs/project/STATE.md` for active blockers. If a blocker affects your task, stop and report it.

## 2. Context Routing Logic (Read what you need)

Before executing any action, identify the type of task and READ the corresponding files:

**🟢 If you are IMPLEMENTING features or writing CODE:**
- READ `.specs/codebase/TESTING.md` (You MUST follow the TDD workflow).
- READ `.specs/codebase/CONVENTIONS.md` (For naming and code style).
- READ `.specs/project/STATE.md` (To understand current focus and blockers).

**🌐 If the feature involves EXTERNAL APIs, Third-Party Services, or Webhooks:**
- READ `.specs/codebase/INTEGRATIONS.md` (To understand auth, limits, and mocking strategies for external services).
- READ `.specs/codebase/TESTING.md` (To check how to stub/mock these integrations properly).

**🔵 If you are PLANNING, DESIGNING, or creating new Modules:**
- READ `.specs/codebase/ARCHITECTURE.md` (For module boundaries, DDD, and database schema isolation rules).
- READ `.specs/project/ROADMAP.md` (To understand the sequence of deliverables).
- READ `.specs/codebase/GLOSSARY.md` (For canonical domain terminology).

**🟠 If you are modifying the DATABASE or creating MIGRATIONS:**
- READ `.specs/codebase/ARCHITECTURE.md` (To check isolation rules like schema-per-module).
- READ `.specs/codebase/CONVENTIONS.md` (To check SQL/table naming conventions like snake_case).
- READ `.specs/codebase/INTEGRATIONS.md` (To check migration directory structure per module).
- READ `.specs/codebase/STACK.md` (To verify the database and migration tool versions).

**🟣 If you FINISHED a task:**
- READ `.specs/codebase/CONCERNS.md` (Check for Tech Debt related to the files you just touched and fix them).
- UPDATE `.specs/project/STATE.md` (Mark task progress, add lessons learned if relevant).

## 3. Project Overview (Quick Reference)

**serviceMaker** — a services marketplace (ecommerce de servicos) where clients request services, providers offer availability, and appointments are scheduled. v1 follows a simplified flow: search provider → check availability → schedule → pay (no proposals/matching system — see AD-001 in STATE.md).

### Tech Stack

- **Java 25** / **Spring Boot 4.0.3** / **Spring Modulith 2.0.3**
- **Spring Data JDBC** (not JPA) for persistence
- **Liquibase** (XML changelogs) for migrations
- **Spring Security** + **BCrypt** + **JWT** for authentication
- **PostgreSQL** with schema-per-module isolation
- **Testcontainers** (PostgreSQL) for integration tests
- **Lombok** for boilerplate reduction
- **springdoc-openapi 3.0.2** for API docs

### Architecture (Summary)

Modular monolith using Spring Modulith. Each module is a top-level package under `br.com.serviceMaker` following DDD internally:

```
{modulo}/
  api/            — REST controllers (inbound adapters)
  application/    — Use cases (one class per use case)
    command/      — Command records (input DTOs)
  domain/         — Aggregates, VOs, repository interfaces, domain exceptions, events
    vo/           — Value objects specific to this module
    exceptions/   — Domain-specific exceptions
  infra/
    persistence/  — Repository implementations (JDBC)
    security/     — Security infrastructure
    config/       — Spring configuration
```

Key rules: Domain MUST NOT depend on Spring. Modules communicate via events. Each module owns its own PostgreSQL schema. Business logic lives in domain entities (Rich Domain Model), use cases only orchestrate.

### Planned Modules

`users` (active) → `services` → `scheduling` → `payments` → `reviews`

## 4. Environment & Commands

```bash
./mvnw compile                          # compile
./mvnw test                             # run all tests
./mvnw test -Dtest=UsuarioTest          # run a single test class
./mvnw test -Dtest=UsuarioTest#testMethod  # run a single test method
./mvnw spring-boot:run                  # boot app
```

**Prerequisites:** Java 25, PostgreSQL on `localhost:5432/servicemaker` (user/pass: postgres/postgres). Tests use Testcontainers (Docker required).

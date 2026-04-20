# External Integrations

## Database

**Service:** PostgreSQL
**Purpose:** Primary data store for all modules
**Implementation:** Spring Data JDBC via `spring-boot-starter-data-jdbc`
**Configuration:** `application.yaml` — `jdbc:postgresql://localhost:5432/servicemaker`
**Authentication:** Username/password (postgres/postgres for local dev)

### Schema Isolation

Each module owns its own PostgreSQL schema (e.g., `users`, `services`, `scheduling`). This enforces data isolation at the database level and aligns with Spring Modulith module boundaries.

- Queries within a module use the module's schema as search path
- Cross-module data access is FORBIDDEN at the SQL level — use events instead
- Schema creation is part of the module's Liquibase migrations

### Migration Structure (Liquibase)

**Format:** XML changelogs
**Master file:** `src/main/resources/db/changelog/db.changelog-master.xml`

Each module MUST have its own subdirectory for migrations. The master file includes module-specific masters:

```
src/main/resources/db/changelog/
├── db.changelog-master.xml          — root master, includes module masters
├── users/
│   ├── users-master.xml             — module master for users
│   ├── 001-create-schema.xml
│   ├── 002-create-usuarios-table.xml
│   └── ...
├── services/                        — created when module becomes active
│   ├── services-master.xml
│   └── ...
└── scheduling/                      — created when module becomes active
    ├── scheduling-master.xml
    └── ...
```

**Root master example:**
```xml
<databaseChangeLog>
    <include file="db/changelog/users/users-master.xml"/>
    <!-- Add new modules here as they become active -->
</databaseChangeLog>
```

**Module master example (users):**
```xml
<databaseChangeLog>
    <include file="db/changelog/users/001-create-schema.xml"/>
    <include file="db/changelog/users/002-create-usuarios-table.xml"/>
</databaseChangeLog>
```

**Naming convention for changesets:** `{NNN}-{description}.xml` where NNN is a zero-padded sequence number within the module.

**Rule:** Never create migrations outside a module directory. Never reference tables from another module's schema in a migration.

## Monitoring

**Service:** Spring Boot Actuator
**Purpose:** Health checks, metrics, application info
**Implementation:** `spring-boot-starter-actuator` (default endpoints)
**Configuration:** Default (no custom actuator config observed)

## API Documentation

**Service:** springdoc-openapi 3.0.2
**Purpose:** Auto-generated Swagger UI for REST API docs
**Implementation:** `springdoc-openapi-starter-webmvc-ui`
**Configuration:** Default (Swagger UI at `/swagger-ui.html`)

## Event Infrastructure

**Service:** Spring Modulith JDBC Events
**Purpose:** Transactional domain event publication and persistence between modules
**Implementation:** `spring-modulith-starter-jdbc` (not yet actively used — no events published yet)
**Configuration:** Default Spring Modulith setup

## Not Yet Integrated

The following are expected based on domain docs but have no implementation yet:
- **Payment gateway** — for processing service payments (low-cost option TBD — see STATE.md deferred ideas)
- **Notification service** — for email/push notifications to providers and clients
- **File storage** — for provider portfolios, profile images (if planned)

**Note:** Search/matching engine and proposals system are deferred to v2 (AD-001).

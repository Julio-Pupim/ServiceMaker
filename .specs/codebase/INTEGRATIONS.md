# External Integrations

## Database

**Service:** PostgreSQL
**Purpose:** Primary data store for all modules
**Implementation:** Spring Data JDBC via `spring-boot-starter-data-jdbc`
**Configuration:** `application.yaml` — `jdbc:postgresql://localhost:5432/servicemaker`
**Authentication:** Username/password (postgres/postgres for local dev)
**Migrations:** Liquibase XML changelogs in `src/main/resources/db/changelog/`

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
- **Payment gateway** — for processing service payments
- **Notification service** — for email/push notifications to providers and clients
- **Search/matching engine** — for finding providers matching service requests
- **File storage** — for provider portfolios, profile images (if planned)

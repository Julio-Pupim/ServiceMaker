# Tech Stack

**Analyzed:** 2026-04-06

## Core

- Framework: Spring Boot 4.0.3
- Language: Java 25
- Runtime: JVM
- Package manager: Maven (wrapper `./mvnw`)
- Modularity: Spring Modulith 2.0.3

## Backend

- API Style: REST (Spring WebMVC)
- Database: PostgreSQL via Spring Data JDBC (not JPA)
- Migrations: Liquibase (XML changelogs, per-module subdirectories — see INTEGRATIONS.md)
- Authentication: Spring Security + BCrypt (`BCryptPasswordEncoder`) + JWT
- Validation: Spring Boot Starter Validation (Bean Validation)
- API Docs: springdoc-openapi 3.0.2 (Swagger UI)
- Monitoring: Spring Boot Actuator

## Testing

- Unit: JUnit 5 + Mockito (via `spring-boot-starter-*-test`)
- Integration: Testcontainers 1.21.4 (PostgreSQL 1.19.8)
- Modulith: `spring-modulith-starter-test` (module boundary verification)
- Architecture: ArchUnit (domain independence, cross-module access rules)
- Coverage: JaCoCo (measurement, no enforced thresholds)
- E2E: None configured

## Development Tools

- Boilerplate: Lombok (annotation processing)
- Build: Maven with `maven-compiler-plugin` + `spring-boot-maven-plugin`

## External Services

- Database: PostgreSQL (`localhost:5432/servicemaker`)
- No external APIs, message brokers, or cloud services configured yet

# Codebase Concerns

**Analysis Date:** 2026-04-06
**Last Updated:** 2026-04-18

## Tech Debt

Whenever you successfully finish a user task, quickly check if there is anything in the `Tech Debt` list of this file that you can resolve within the same file you just worked on. If there is, fix it and mark it as resolved here.

**JdbcUserRepository is a stub:**

- Issue: All methods return `Optional.empty()` or `null` — no actual JDBC implementation
- Files: `src/main/java/br/com/serviceMaker/users/infra/persistence/JdbcUserRepository.java`
- Why: Project is in early scaffold phase, domain model built first
- Impact: Use cases compile but do nothing at runtime. `save()` returns `null` which will cause NPE in `RegisterUserUseCase.execute()` (calls `.getId()` on result)
- Fix approach: Implement using `NamedParameterJdbcTemplate`. Must also create Liquibase migration for `users` schema tables.

**Liquibase has only a test table:**

- Issue: Only migration is a `test_table` with no relation to the domain
- Files: `src/main/resources/db/changelog/db.changelog-master.xml`
- Why: Initial DB connectivity validation
- Impact: No actual tables exist for domain entities. All persistence is non-functional.
- Fix approach: Create proper migrations under `db/changelog/users/` directory following the per-module structure defined in INTEGRATIONS.md.

**Empty placeholder classes:**

- Issue: `UserController`, `UsersConfig`, `UserEntityMapper` are empty classes with no implementation
- Files: `users/api/UserController.java`, `users/infra/config/UsersConfig.java`, `users/infra/persistence/UserEntityMapper.java`
- Impact: Low — these are scaffolds. But they may confuse about project readiness.
- Fix approach: Implement as each layer is built out, or remove until needed.

**Domain naming not yet in Portuguese:**

- Issue: All domain classes use English names (`User`, `ProviderProfile`, `EmailAlreadyExistsException`) but the project directive requires Portuguese domain language.
- Files: All files under `users/domain/`, `shared/`
- Impact: Medium — creates inconsistency between documentation (GLOSSARY.md, CONVENTIONS.md) and code. New code may follow conflicting patterns.
- Fix approach: Rename incrementally during Phase 2 implementation. See GLOSSARY.md for canonical names. Prioritize renaming during tasks that already touch these files.

## Security Considerations

**Database credentials in plain text:**

- Risk: PostgreSQL credentials (`postgres/postgres`) hardcoded in `application.yaml`
- Files: `src/main/resources/application.yaml`
- Current mitigation: None — acceptable for local dev only
- Recommendations: Use environment variables or Spring profiles for non-dev environments. Add `application-prod.yaml` with externalized config. Consider Spring Cloud Config or Vault for production.

**No Spring Security configuration:**

- Risk: Spring Security starter is on classpath but no custom `SecurityFilterChain` is configured. Default config will secure all endpoints with a generated password.
- Files: No security config class exists
- Current mitigation: Default Spring Security auto-configuration
- Recommendations: Create explicit `SecurityConfig` with endpoint-level authorization rules before exposing REST APIs. Planned in T10/T11.

## Fragile Areas

**Value object inconsistency:**

- Files: `shared/UserId.java` (record), `shared/Email.java` (class), `shared/Cpf.java`, `shared/UserName.java`
- Why fragile: Mixed approaches — `UserId` is a `record` with auto equals/hashCode, while `Email` is a traditional class with manual equals/hashCode. This inconsistency could lead to subtle bugs if new VOs don't follow the right pattern.
- Safe modification: Pick one approach (recommend `record` for all simple VOs) and standardize.
- Test coverage: VOs are tested indirectly through `UserTest`. No dedicated VO tests.

## Test Coverage Gaps

**No repository integration tests:**

- What's not tested: `JdbcUserRepository` (stub, but even when implemented needs tests)
- Risk: Persistence layer bugs will not be caught. This is the #1 priority gap since persistence is the next implementation step.
- Priority: High
- Difficulty to test: Low — Testcontainers infrastructure is already in place

**No controller/API tests:**

- What's not tested: REST endpoints (none exist yet, but `UserController` is scaffolded)
- Risk: API contract, validation, and HTTP behavior untested
- Priority: Medium (blocked until controllers are implemented)
- Difficulty to test: Low — use `@SpringBootTest(webEnvironment = RANDOM_PORT)` + Testcontainers + TestRestTemplate (see TESTING.md)

**No Spring Modulith boundary tests:**

- What's not tested: Module boundary enforcement
- Risk: Cross-module dependencies could silently form, violating the modular monolith architecture
- Priority: High — should be created as part of ArchitectureTest.java (see TESTING.md)
- Difficulty to test: Low — `spring-modulith-starter-test` provides `ApplicationModules.verify()` out of the box

**No ArchUnit architectural tests:**

- What's not tested: Domain independence from Spring, cross-module repository access
- Risk: Agent or developer may accidentally add `@Service` to domain entities or access another module's repository
- Priority: High — prevents architectural erosion
- Difficulty to test: Low — ArchUnit is straightforward to configure (see TESTING.md)

**No dedicated Value Object tests:**

- What's not tested: Individual VO validation (Email format, CPF length, UserName minimum)
- Risk: VOs are tested indirectly through `UserTest`, but edge cases in VO construction may be missed
- Priority: Low (currently covered transitively)
- Difficulty to test: Low — pure unit tests

---

_Concerns audit: 2026-04-06_
_Last review: 2026-04-18_
_Update as issues are fixed or new ones discovered_

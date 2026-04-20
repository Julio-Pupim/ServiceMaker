# Testing Infrastructure

## Rules

You are a test-driven agent. Follow EXACTLY this order when receiving a coding task:

1. **TEST BEFORE CODE:** Write the test class FIRST.
    * For Domain: Create a pure unit test without Spring.
    * For UseCase: Use Mockito (`@ExtendWith(MockitoExtension.class)`).
    * For Infra/Repository: Use Testcontainers (PostgreSQL).
    * For Controller/API: Use `@SpringBootTest` + Testcontainers + `TestRestTemplate`.
2. **RUN FAILING TEST:** Run the specific test using `./mvnw test -Dtest=TestName` and verify that it fails (Red phase).
3. **IMPLEMENTATION:** Write the minimum production code to make the test pass (Green phase).
4. **FINAL VERIFICATION:** Run `./mvnw test` and make sure it DID NOT BREAK ANY other tests in the system. If it did, undo or fix it before marking the task as complete.

## Test Frameworks

**Unit/Integration:** JUnit 5 + Mockito (via Spring Boot test starters)
**Containers:** Testcontainers 1.21.4 (PostgreSQL 1.19.8)
**Modulith:** `spring-modulith-starter-test` (module boundary verification)
**Architecture:** ArchUnit (architectural rule enforcement — see Architectural Tests section)
**Coverage:** JaCoCo (measurement only — see Coverage section)
**E2E:** use the mcp

## Test Organization

**Location:** `src/test/java/br/com/serviceMaker/` (mirrors main source tree)
**Naming:** `{ClassUnderTest}Test` (e.g., `UsuarioTest`, `RegistrarUsuarioUseCaseTest`)
**Structure:** Tests organized by module, matching the main source package structure

## Testing Patterns

### Unit Tests — Domain

**Approach:** Pure unit tests, no Spring context, no mocks
**Location:** `src/test/java/br/com/serviceMaker/users/domain/`
**Pattern:** Direct instantiation of domain entities via factory methods, assertions on behavior
**Example:** `UsuarioTest` — tests `registrar()`, `criarPerfilPrestador()`, `desativar()`, `alterarSenha()` directly

### Unit Tests — Use Cases

**Approach:** Mockito-based unit tests, no Spring context
**Location:** `src/test/java/br/com/serviceMaker/users/application/`
**Pattern:** `@ExtendWith(MockitoExtension.class)`, `@Mock` for repository/infra interfaces, manual instantiation of use case in `@BeforeEach`
**Example:** `RegistrarUsuarioUseCaseTest` — mocks `UsuarioRepository` and `PasswordHasher`, verifies orchestration logic

### Integration Tests — Repository

**Approach:** Testcontainers with PostgreSQL for database tests
**Location:** `src/test/java/br/com/serviceMaker/{module}/infra/persistence/`
**Pattern:** `@SpringBootTest` + `@Testcontainers` + PostgreSQL container. Test full aggregate persistence (save, findById, findByEmail, etc.)
**Example:** `JdbcUsuarioRepositoryTest` — verifies CRUD operations with real PostgreSQL

### Integration Tests — Controller/API

**Approach:** Full Spring context with Testcontainers and TestRestTemplate
**Location:** `src/test/java/br/com/serviceMaker/{module}/api/`
**Pattern:** `@SpringBootTest(webEnvironment = RANDOM_PORT)` + `@Testcontainers` + `TestRestTemplate`. Validates HTTP status codes, request/response bodies, error handling, and security (JWT).
**Example:** `UsuarioControllerTest` — tests POST /api/users, PATCH /api/users/me/deactivate, etc.

### Architectural Tests

**Approach:** ArchUnit + Spring Modulith for automated architecture enforcement
**Location:** `src/test/java/br/com/serviceMaker/ArchitectureTest.java`
**Purpose:** Prevent architectural violations that TDD alone cannot catch. These tests MUST exist and MUST pass at all times.

**Required rules:**

1. **Domain independence from Spring:** Classes in `..domain..` packages MUST NOT depend on any `org.springframework..` package. This prevents `@Service`, `@Autowired`, `@Transactional`, and similar annotations from leaking into domain entities.

```java
@Test
void domain_should_not_depend_on_spring() {
    noClasses()
        .that().resideInAPackage("..domain..")
        .should().dependOnClassesThat()
        .resideInAPackage("org.springframework..")
        .check(importedClasses);
}
```

2. **Module boundary enforcement:** Use cases MUST NOT access repositories from other modules. Each module's `application` layer should only use its own `domain` interfaces.

```java
@Test
void use_cases_should_not_access_other_module_repositories() {
    classes()
        .that().resideInAPackage("..users.application..")
        .should().onlyAccessClassesThat()
        .resideInAnyPackage(
            "..users..", "..shared..", "java..", "lombok..",
            "org.springframework.."
        )
        .check(importedClasses);
}
```

3. **Spring Modulith boundaries:** Module isolation verified by Spring Modulith's built-in test.

```java
@Test
void modulesVerify() {
    ApplicationModules.of(ServiceMakerApplication.class).verify();
}
```

### Test Method Naming

**Convention:** `should_{describe_expected_behavior}` with underscores
**Examples:**
- `should_register_user_and_return_id`
- `should_throw_when_email_already_registered`
- `should_not_allow_two_provider_profiles`

## Test Execution

**Commands:**
```bash
./mvnw test                             # Run all tests
./mvnw test -Dtest=UsuarioTest          # Single test class
./mvnw test -Dtest=UsuarioTest#testMethod  # Single test method
```

**Configuration:** Default Spring Boot test config. Testcontainers requires Docker running.

## Coverage

**Tool:** JaCoCo (configured in pom.xml)
**Mode:** Measurement only — no build-breaking thresholds enforced.
**Report:** Generated at `target/site/jacoco/index.html` after `./mvnw test`.
**Qualitative rule:** Every public method in `domain` and `application` layers MUST have at least one test validating the expected behavior AND at least one test validating the error/edge case. This is more valuable than a numeric target.
**Monitoring:** Run `./mvnw jacoco:report` to check coverage after implementing a feature. If domain or application coverage drops below 80%, investigate which behaviors are untested.

## Test Coverage Matrix

| Code Layer | Required Test Type | Location Pattern | Run Command |
|---|---|---|---|
| Domain entities | Unit (pure) | `src/test/**/domain/*Test.java` | `./mvnw test -Dtest=*Test` |
| Value objects (shared) | Unit (pure) | `src/test/**/shared/*Test.java` | `./mvnw test -Dtest=*Test` |
| Use cases (application) | Unit (mocked) | `src/test/**/application/*Test.java` | `./mvnw test -Dtest=*UseCaseTest` |
| Repository implementations | Integration (Testcontainers) | `src/test/**/persistence/*Test.java` | `./mvnw test -Dtest=*RepositoryTest` |
| Controllers (api) | Integration (SpringBootTest + Testcontainers) | `src/test/**/api/*Test.java` | `./mvnw test -Dtest=*ControllerTest` |
| Architecture rules | ArchUnit + Modulith | `src/test/**/ArchitectureTest.java` | `./mvnw test -Dtest=ArchitectureTest` |

## Parallelism Assessment

| Test Type | Parallel-Safe? | Isolation Model | Evidence |
|---|---|---|---|
| Domain unit | Yes | No shared state | Pure object construction, no I/O |
| Use case unit | Yes | Mockito per-test isolation | `@ExtendWith(MockitoExtension.class)` creates fresh mocks |
| Integration (DB) | Yes | Testcontainers per-test DB | `spring-boot-testcontainers` creates isolated containers |
| Architecture | Yes | Static analysis | No runtime state |

## Gate Check Commands

| Gate Level | When to Use | Command |
|---|---|---|
| Quick | After domain/use-case changes | `./mvnw test` |
| Full | After infra/persistence changes | `./mvnw test` |
| Build | After phase completion | `./mvnw compile && ./mvnw test` |
| Coverage | After feature completion | `./mvnw test jacoco:report` |

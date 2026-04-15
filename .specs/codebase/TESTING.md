# Testing Infrastructure

## Rules
You are a test-driven agent. Follow EXACTLY this order when receiving a coding task:

1. **TEST BEFORE CODE:** Write the test class FIRST.
    * For Domain: Create a pure unit test without Spring.
    * For UseCase: Use Mockito (`@ExtendWith(MockitoExtension.class)`).
    * For Infra/Repository: Use Testcontainers (PostgreSQL).
2. **RUN FAILING TEST:** Run the specific test using `./mvnw test -Dtest=TestName` and verify that it fails (Red phase).
3. **IMPLEMENTATION:** Write the minimum production code to make the test pass (Green phase).
4. **FINAL VERIFICATION:** Run `./mvnw test` and make sure it DID NOT BREAK ANY other tests in the system. If it did, undo or fix it before marking the task as complete.


## Test Frameworks

**Unit/Integration:** JUnit 5 + Mockito (via Spring Boot test starters)
**Containers:** Testcontainers 1.21.4 (PostgreSQL 1.19.8)
**Modulith:** `spring-modulith-starter-test` (module boundary verification)
**E2E:** use the mcp 
**Coverage:** No coverage tool configured

## Test Organization

**Location:** `src/test/java/br/com/serviceMaker/` (mirrors main source tree)
**Naming:** `{ClassUnderTest}Test` (e.g., `UserTest`, `RegisterUserUseCaseTest`)
**Structure:** Tests organized by module, matching the main source package structure

## Testing Patterns

### Unit Tests — Domain

**Approach:** Pure unit tests, no Spring context, no mocks
**Location:** `src/test/java/br/com/serviceMaker/users/domain/`
**Pattern:** Direct instantiation of domain entities via factory methods, assertions on behavior
**Example:** `UserTest` — tests `registerUser()`, `createProviderProfile()`, `deactivate()`, `changePassword()` directly

### Unit Tests — Use Cases

**Approach:** Mockito-based unit tests, no Spring context
**Location:** `src/test/java/br/com/serviceMaker/users/application/`
**Pattern:** `@ExtendWith(MockitoExtension.class)`, `@Mock` for repository/infra interfaces, manual instantiation of use case in `@BeforeEach`
**Example:** `RegisterUserUseCaseTest` — mocks `UserRepository` and `PasswordHasher`, verifies orchestration logic

### Integration Tests

**Approach:** Testcontainers with PostgreSQL for database tests
**Location:** `src/test/java/br/com/serviceMaker/` (root level)
**Example:** `DatabaseConnectionTest` — verifies DB connectivity with Testcontainers

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
./mvnw test -Dtest=UserTest             # Single test class
./mvnw test -Dtest=UserTest#testMethod  # Single test method
```

**Configuration:** Default Spring Boot test config. Testcontainers requires Docker running.

## Coverage Targets

**Current:** Not measured
**Goals:** Not documented
**Enforcement:** None

## Test Coverage Matrix

| Code Layer | Required Test Type | Location Pattern | Run Command |
|---|---|---|---|
| Domain entities | Unit (pure) | `src/test/**/domain/*Test.java` | `./mvnw test -Dtest=*Test` |
| Use cases (application) | Unit (mocked) | `src/test/**/application/*Test.java` | `./mvnw test -Dtest=*UseCaseTest` |
| Repository implementations | Integration (Testcontainers) | `src/test/**/persistence/*Test.java` | `./mvnw test -Dtest=*RepositoryTest` |
| Controllers (api) | none (not yet implemented) | — | — |
| Value objects (shared) | none (tested indirectly via domain tests) | — | — |

## Parallelism Assessment

| Test Type | Parallel-Safe? | Isolation Model | Evidence |
|---|---|---|---|
| Domain unit | Yes | No shared state | Pure object construction, no I/O |
| Use case unit | Yes | Mockito per-test isolation | `@ExtendWith(MockitoExtension.class)` creates fresh mocks |
| Integration (DB) | Yes | Testcontainers per-test DB | `spring-boot-testcontainers` creates isolated containers |

## Gate Check Commands

| Gate Level | When to Use | Command |
|---|---|---|
| Quick | After domain/use-case changes | `./mvnw test` |
| Full | After infra/persistence changes | `./mvnw test` |
| Build | After phase completion | `./mvnw compile && ./mvnw test` |

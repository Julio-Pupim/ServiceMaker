# Architecture Rules

**Pattern:** Modular Monolith (Spring Modulith) with Domain-Driven Design

## Module Isolation

- Modules MUST NOT access other module's domain directly
- Communication MUST happen via events
- Module boundaries MUST be validated using Spring Modulith tests
- The test ServiceMakerApplicationTests.modulesVerify MUST always pass
## Domain Rules

- Domain MUST NOT depend on Spring
- Domain MUST NOT use annotations (except Lombok if needed)

## Application Layer

- MUST NOT contain business rules
- MUST orchestrate domain only
- MUST implement Command Pattern for each Use Case
## Infra Layer

- MUST implement domain interfaces only
- **Attention** Each Module has its own scheme for isolating tables. Following the same module isolation principle

## High-Level Structure

```
serviceMaker
├── shared/          — Cross-module value objects (shared kernel)
├── users/           — User management module (active development)
├── services/        — Provider service catalog (scaffold)
├── requests/        — Service requests from clients (scaffold)
├── proposals/       — Provider proposals (scaffold)
├── scheduling/      — Appointment scheduling (scaffold)
├── payments/        — Payment processing (scaffold)
├── reviews/         — Service reviews (scaffold)
├── categories/      — Service categories (scaffold)
└── search/          — Matching/search (scaffold)
```

## Identified Patterns

### Rich Domain Model

**Location:** `{module}/domain/`
**Purpose:** Business logic lives in domain entities, not use cases
**Implementation:** Static factory methods for creation, instance methods for mutations. Private constructor enforces invariants at creation.
**Example:** `User.registerUser()` creates user with CLIENT role and ClientProfile. `User.createProviderProfile()` adds PROVIDER role with guard against duplicates.

### Command Pattern for Use Cases

**Location:** `{module}/application/command/`
**Purpose:** Each use case receives a single command record as input, returns a domain value
**Implementation:** Java `record` types as immutable command DTOs. One use case class per operation.
**Example:** `RegisterUserCommand` → `RegisterUserUseCase.execute()` → returns `UserId`

### Domain Interfaces for Infrastructure

**Location:** Interfaces in `{module}/domain/`, implementations in `{module}/infra/`
**Purpose:** Dependency inversion — domain defines contracts, infra provides implementations
**Example:** `UserRepository` (domain interface) → `JdbcUserRepository` (infra), `PasswordHasher` (domain interface) → `BCryptPasswordHasher` (infra)

### Self-Validating Value Objects

**Location:** `shared/` and `{module}/domain/vo/`
**Purpose:** Domain primitives that enforce invariants at construction
**Implementation:** Private constructors with validation, static `of()` factory methods. Some use `record` (e.g., `UserId`), others use classes with manual `equals`/`hashCode` (e.g., `Email`).
**Example:** `Email.of("bad")` throws `IllegalArgumentException`, `UserId.generate()` creates UUID-backed ID

### Domain Exceptions

**Location:** `{module}/domain/exceptions/`
**Purpose:** Typed exceptions for domain rule violations
**Implementation:** Extend `RuntimeException` with descriptive messages
**Example:** `EmailAlreadyExistsException`, `CpfAlreadyExistsException`, `UserNotFoundException`

## Data Flow

### User Registration Flow

```
Controller (api/) → RegisterUserUseCase (application/)
  → check email uniqueness via UserRepository
  → check CPF uniqueness via UserRepository
  → hash password via PasswordHasher
  → User.registerUser() creates domain entity
  → UserRepository.save() persists
  → returns UserId
```

### Event-Driven Module Communication (planned)

```
Client creates request → ServiceRequestedEvent
→ Matching finds providers → Notification sent
→ Provider submits proposal → ProposalSubmittedEvent
→ Client accepts → ProposalAcceptedEvent
→ AppointmentScheduledEvent → ServiceCompletedEvent → ReviewCreatedEvent
```

Events use Spring Modulith's event infrastructure (`spring-modulith-starter-jdbc` for transactional event persistence).

## Code Organization

**Approach:** Domain-Driven Design within each Spring Modulith module

**Module internal structure:**
```
{module}/
  api/            — REST controllers (inbound adapters)
  application/    — Use cases (application services)
    command/      — Input DTOs (Java records)
  domain/         — Aggregates, VOs, repository interfaces, domain exceptions
    vo/           — Value objects
    exceptions/   — Domain exceptions
  infra/
    persistence/  — Repository implementations (Spring Data JDBC)
    security/     — Security infrastructure
    config/       — Spring configuration
```


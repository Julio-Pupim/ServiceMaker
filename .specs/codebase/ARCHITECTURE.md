# Architecture Rules

**Pattern:** Modular Monolith (Spring Modulith) with Domain-Driven Design

## Module Isolation

- Modules MUST NOT access other module's domain directly
- Communication MUST happen via events
- Module boundaries MUST be validated using Spring Modulith tests (`ApplicationModules.verify()`)
- Architectural rules MUST be enforced by ArchUnit tests (see TESTING.md)
- The test ServiceMakerApplicationTests.modulesVerify MUST always pass

## Domain Rules

- Domain MUST NOT depend on Spring (no `@Service`, `@Autowired`, `@Component`, `@Transactional` etc.)
- Domain MUST NOT use Spring annotations (Lombok annotations like `@Getter` are allowed)
- Domain entities use Portuguese names (see `GLOSSARY.md`)

## Application Layer

- MUST NOT contain business rules
- MUST orchestrate domain only
- MUST implement Command Pattern for each Use Case
- MUST NOT duplicate domain invariants (e.g., guards for `estaAtivo()` live in the aggregate, not in use cases)

## Infra Layer

- MUST implement domain interfaces only
- **Attention:** Each Module has its own PostgreSQL schema for isolating tables. Following the same module isolation principle.
- Migrations organized per module (see INTEGRATIONS.md for directory structure)

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

**Note:** `requests/` and `proposals/` modules are deferred to v2 (see AD-001 in STATE.md). v1 uses a simplified flow without proposals.

## Identified Patterns

### Rich Domain Model

**Location:** `{module}/domain/`
**Purpose:** Business logic lives in domain entities, not use cases
**Implementation:** Static factory methods for creation, instance methods for mutations. Private constructor enforces invariants at creation.
**Example:** `Usuario.registrar()` creates user with CLIENTE role and PerfilCliente. `Usuario.criarPerfilPrestador()` adds PRESTADOR role with guard against duplicates and inactive state.

### Command Pattern for Use Cases

**Location:** `{module}/application/command/`
**Purpose:** Each use case receives a single command record as input, returns a domain value
**Implementation:** Java `record` types as immutable command DTOs. One use case class per operation.
**Example:** `RegistrarUsuarioCommand` → `RegistrarUsuarioUseCase.execute()` → returns `UsuarioId`

### Domain Interfaces for Infrastructure

**Location:** Interfaces in `{module}/domain/`, implementations in `{module}/infra/`
**Purpose:** Dependency inversion — domain defines contracts, infra provides implementations
**Example:** `UsuarioRepository` (domain interface) → `JdbcUsuarioRepository` (infra), `PasswordHasher` (domain interface) → `BCryptPasswordHasher` (infra)

### Self-Validating Value Objects

**Location:** `shared/` and `{module}/domain/vo/`
**Purpose:** Domain primitives that enforce invariants at construction
**Implementation:** Private constructors with validation, static `of()` factory methods. Prefer Java `record` for all simple VOs.
**Example:** `Email.of("invalido")` throws `IllegalArgumentException`, `UsuarioId.generate()` creates UUID-backed ID

### Domain Exceptions

**Location:** `{module}/domain/exceptions/`
**Purpose:** Typed exceptions for domain rule violations
**Implementation:** Extend `RuntimeException` with descriptive messages in Portuguese
**Example:** `EmailJaCadastradoException`, `CpfJaCadastradoException`, `UsuarioNaoEncontradoException`

## Data Flow

### User Registration Flow (v1)

```
Controller (api/) → RegistrarUsuarioUseCase (application/)
  → check email uniqueness via UsuarioRepository
  → check CPF uniqueness via UsuarioRepository
  → hash password via PasswordHasher
  → Usuario.registrar() creates domain entity
  → UsuarioRepository.save() persists
  → publish UsuarioRegistradoEvent
  → returns UsuarioId
```

### v1 Simplified Flow (AD-001)

```
Cliente busca prestador → ve disponibilidade → agenda servico
→ AgendamentoRealizadoEvent
→ Pagamento processado → PagamentoProcessadoEvent
→ Servico concluido → ServicoConcluidoEvent
→ Avaliacao criada → AvaliacaoCriadaEvent
```

**Note:** v1 does NOT have proposals or matching. Clients schedule directly with providers. See AD-001 in STATE.md.

### v2 Event-Driven Flow (future)

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
{modulo}/
  api/            — REST controllers (inbound adapters)
  application/    — Use cases (application services)
    command/      — Input DTOs (Java records)
  domain/         — Aggregates, VOs, repository interfaces, domain exceptions, events
    vo/           — Value objects
    exceptions/   — Domain exceptions
  infra/
    persistence/  — Repository implementations (Spring Data JDBC)
    security/     — Security infrastructure
    config/       — Spring configuration
```

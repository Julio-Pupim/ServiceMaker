# Code Conventions

## Naming Conventions

**Packages:** lowercase, singular nouns following DDD layers
Examples: `users.domain`, `users.application.command`, `users.infra.persistence`

**Classes:**
- Domain entities: PascalCase nouns (`User`, `ProviderProfile`, `ClientProfile`)
- Use cases: `{Verb}{Noun}UseCase` (`RegisterUserUseCase`, `ChangePasswordUseCase`)
- Commands: `{Verb}{Noun}Command` (`RegisterUserCommand`, `DeactivateUserCommand`)
- Repositories: `{Entity}Repository` (interface), `Jdbc{Entity}Repository` (impl)
- Exceptions: `{Description}Exception` (`EmailAlreadyExistsException`)
- Value objects: descriptive nouns (`PasswordHash`, `Email`, `UserId`)
- Enums: PascalCase with UPPER_SNAKE values (`UserRole.CLIENT`)

**Methods:**
- Factory methods: `of()` for VOs, `{verb}{Noun}()` for aggregates (`User.registerUser()`)
- Use case entry point: `execute(Command)`
- Boolean queries: `has{Thing}()`, `is{State}()` (`hasProviderProfile()`, `isActive()`)

**Test methods:** `should_{describe_behavior}` with underscores (`should_register_user_with_client_role`)

## Code Organization

**Import ordering:** Java standard libs → Spring/third-party → project packages (no enforced formatter observed)

**File structure:**
- Fields first, then constructors (private), then static factory methods, then instance methods
- Lombok `@Getter` on class level, manual getters only for immutable collections (`Collections.unmodifiableSet`)

## Type Safety

**Value objects over primitives:** IDs (`UserId`), email (`Email`), CPF (`Cpf`), names (`UserName`), password hashes (`PasswordHash`)

**Shared kernel VOs** live in `br.com.serviceMaker.shared` — used across modules
**Module-specific VOs** live in `{module}/domain/vo/`

**Mixed VO styles:**
- `UserId`: Java `record` (concise, auto equals/hashCode)
- `Email`, `Cpf`: Traditional classes with private constructor, manual `equals`/`hashCode`, `of()` factory

## Error Handling

**Pattern:** Domain exceptions extend `RuntimeException` (unchecked)
- Thrown from use cases for business rule violations
- Thrown from value objects for invalid input
- Example: `EmailAlreadyExistsException`, `IllegalArgumentException` for blank values

## Dependency Injection

**Pattern:** Constructor injection via Lombok `@AllArgsConstructor`
- Use cases: `@Service @AllArgsConstructor`
- Infra implementations: `@Repository`, `@Component`
- All dependencies are `private final`

## Comments/Documentation

**Style:** Minimal — no Javadoc observed. Code is self-documenting via descriptive naming.
Domain docs are external Markdown files (`Eventos.md`, `Estados.md`).

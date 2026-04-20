# Code Conventions

## Naming Conventions

**Referencia canonica:** Consulte `.specs/codebase/GLOSSARY.md` para a lista completa de termos do dominio.

**Packages:** lowercase, singular nouns following DDD layers
Examples: `users.domain`, `users.application.command`, `users.infra.persistence`

**Classes:**
- Domain entities: PascalCase nouns em portugues (`Usuario`, `PerfilPrestador`, `PerfilCliente`)
- Use cases: `{Verbo}{Substantivo}UseCase` (`RegistrarUsuarioUseCase`, `AlterarSenhaUseCase`)
- Commands: `{Verbo}{Substantivo}Command` (`RegistrarUsuarioCommand`, `DesativarUsuarioCommand`)
- Repositories: `{Entidade}Repository` (interface), `Jdbc{Entidade}Repository` (impl) — ex: `UsuarioRepository`, `JdbcUsuarioRepository`
- Exceptions: nomes descritivos em portugues (`EmailJaCadastradoException`, `UsuarioNaoEncontradoException`). Excecoes de infraestrutura podem ser em ingles.
- Value objects: substantivos descritivos (`HashSenha`, `Email`, `UsuarioId`)
- Enums: PascalCase com valores UPPER_SNAKE (`PapelUsuario.CLIENTE`, `PapelUsuario.PRESTADOR`)
- Domain events: `{Substantivo}{Participio}Event` em portugues (`UsuarioRegistradoEvent`, `SenhaAlteradaEvent`)

**Methods:**
- Factory methods: `of()` para VOs, `{verbo}()` ou `{verbo}{Substantivo}()` para agregados (`Usuario.registrar()`, `Usuario.criarPerfilPrestador()`)
- Use case entry point: `execute(Command)`
- Boolean queries: `tem{Coisa}()`, `esta{Estado}()` (`temPerfilPrestador()`, `estaAtivo()`)

**Test methods:** `should_{describe_behavior}` com underscores (`should_register_user_with_client_role`). Descricoes de teste permanecem em ingles para legibilidade universal.

**SQL / Database:**
- Table names: `snake_case`, plural, prefixado pelo schema do modulo (`users.usuarios`, `users.papeis_usuario`)
- Column names: `snake_case` (`created_at`, `password_hash`, `is_active`)
- Constraints: `{table}_{column}_key` para UNIQUE, `{table}_{column}_fkey` para FK

## Code Organization

**Import ordering:** Java standard libs → Spring/third-party → project packages (no enforced formatter observed)

**File structure:**
- Fields first, then constructors (private), then static factory methods, then instance methods
- Lombok `@Getter` on class level, manual getters only for immutable collections (`Collections.unmodifiableSet`)

## Type Safety

**Value objects over primitives:** IDs (`UsuarioId`), email (`Email`), CPF (`Cpf`), names (`NomeUsuario`), password hashes (`HashSenha`)

**Shared kernel VOs** live in `br.com.serviceMaker.shared` — used across modules
**Module-specific VOs** live in `{module}/domain/vo/`

**VO style:** Prefer Java `record` for all simple VOs (auto equals/hashCode, concise). Use traditional class only when mutable state or complex validation logic requires it. See CONCERNS.md for the current inconsistency to resolve.

## Error Handling

**Pattern:** Domain exceptions extend `RuntimeException` (unchecked)
- Thrown from domain entities/aggregates for business rule violations
- Thrown from value objects for invalid input
- Example: `EmailJaCadastradoException`, `IllegalArgumentException` for blank values

## Dependency Injection

**Pattern:** Constructor injection via Lombok `@AllArgsConstructor`
- Use cases: `@Service @AllArgsConstructor`
- Infra implementations: `@Repository`, `@Component`
- All dependencies are `private final`

## Comments/Documentation

**Style:** Minimal — no Javadoc observed. Code is self-documenting via descriptive naming.
Domain docs are external Markdown files (`Eventos.md`, `Estados.md`).

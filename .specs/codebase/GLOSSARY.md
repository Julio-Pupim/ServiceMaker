# Glossario — Ubiquitous Language

**Idioma do dominio:** Portugues Brasileiro.
**Regra:** Toda classe de dominio (entidades, VOs, eventos, excecoes) usa nomes em portugues. Sufixos estruturais (Repository, UseCase, Controller, Command, Service) permanecem em ingles.

---

## Termos Canonicos

| Termo de Dominio | Classe Java | Tipo | Modulo |
|---|---|---|---|
| Usuario | `Usuario` | Aggregate Root | users |
| Perfil de Cliente | `PerfilCliente` | Entity (within aggregate) | users |
| Perfil de Prestador | `PerfilPrestador` | Entity (within aggregate) | users |
| Papel do Usuario | `PapelUsuario` | Enum (`CLIENTE`, `PRESTADOR`) | users |
| Email | `Email` | Value Object (shared) | shared |
| CPF | `Cpf` | Value Object (shared) | shared |
| Nome do Usuario | `NomeUsuario` | Value Object (shared) | shared |
| ID do Usuario | `UsuarioId` | Value Object (shared) | shared |
| Hash de Senha | `HashSenha` | Value Object | users |
| Servico | `Servico` | Aggregate Root | services |
| Categoria | `Categoria` | Entity | categories |
| Agendamento | `Agendamento` | Aggregate Root | scheduling |
| Pagamento | `Pagamento` | Aggregate Root | payments |
| Avaliacao | `Avaliacao` | Aggregate Root | reviews |

---

## Eventos de Dominio

| Evento | Classe Java | Modulo |
|---|---|---|
| Usuario registrado | `UsuarioRegistradoEvent` | users |
| Perfil de prestador criado | `PerfilPrestadorCriadoEvent` | users |
| Usuario desativado | `UsuarioDesativadoEvent` | users |
| Senha alterada | `SenhaAlteradaEvent` | users |
| Servico criado | `ServicoCriadoEvent` | services |
| Agendamento realizado | `AgendamentoRealizadoEvent` | scheduling |
| Servico concluido | `ServicoConcluidoEvent` | scheduling |
| Pagamento processado | `PagamentoProcessadoEvent` | payments |
| Avaliacao criada | `AvaliacaoCriadaEvent` | reviews |

---

## Excecoes de Dominio

| Situacao | Classe Java | Modulo |
|---|---|---|
| Email ja cadastrado | `EmailJaCadastradoException` | users |
| CPF ja cadastrado | `CpfJaCadastradoException` | users |
| Usuario nao encontrado | `UsuarioNaoEncontradoException` | users |
| Senha invalida | `SenhaInvalidaException` | users |
| Usuario inativo | `UsuarioInativoException` | users |

---

## Naming Patterns (com exemplos reais)

| Tipo | Pattern | Exemplo |
|---|---|---|
| Use Case | `{Verbo}{Substantivo}UseCase` | `RegistrarUsuarioUseCase` |
| Command | `{Verbo}{Substantivo}Command` | `RegistrarUsuarioCommand` |
| Repository (interface) | `{Entidade}Repository` | `UsuarioRepository` |
| Repository (impl) | `Jdbc{Entidade}Repository` | `JdbcUsuarioRepository` |
| Controller | `{Entidade}Controller` | `UsuarioController` |
| Exception Handler | `{Entidade}ExceptionHandler` | `UsuarioExceptionHandler` |
| Mapper | `{Entidade}EntityMapper` | `UsuarioEntityMapper` |
| Factory method (VO) | `of()` | `Email.of("x@y.com")` |
| Factory method (aggregate) | `{verbo}{Substantivo}()` | `Usuario.registrar()` |
| Boolean query | `tem{Coisa}()`, `esta{Estado}()` | `temPerfilPrestador()`, `estaAtivo()` |

---

## Nota sobre Codigo Existente

O codigo atual usa nomes em ingles (`User`, `ProviderProfile`, `EmailAlreadyExistsException`). A migracao para portugues sera feita incrementalmente. Ao criar codigo **novo**, use SEMPRE os nomes canonicos deste glossario. Ao modificar codigo existente, renomeie para portugues na mesma PR se o escopo permitir.

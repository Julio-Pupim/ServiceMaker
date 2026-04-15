# Cadastro de Usuario - Specification

## Problem Statement

O marketplace precisa permitir que novos usuarios se registrem como clientes. Sem cadastro, nao ha base de usuarios para consumir ou oferecer servicos. O registro eh o ponto de entrada para todo o fluxo do sistema.

## Goals

- [ ] Usuario consegue se registrar com email, CPF, nome e senha
- [ ] Dados unicos (email, CPF) sao validados antes da persistencia
- [ ] Senha eh armazenada de forma segura (hash — algoritmo eh detalhe de infra)
- [ ] Dados persistem no banco de dados PostgreSQL via Spring Data JDBC
- [ ] API REST disponivel para registro de usuario

## Out of Scope

| Feature                          | Reason                                                  |
| -------------------------------- | ------------------------------------------------------- |
| Verificacao de email             | Complexidade desnecessaria para MVP de estudo            |
| Login / JWT / Autenticacao       | Sera tratado como feature separada                      |
| OAuth / Login social             | Fora do escopo v1                                       |
| Upload de foto de perfil         | Nao essencial para registro                             |
| Validacao de digito verificador CPF | Complexidade extra sem valor para estudo (apenas formato) |
| Recuperacao de senha             | Feature separada                                        |

---

## User Stories

### P1: Registro de novo usuario ⭐ MVP

**User Story**: Como visitante, quero me registrar no sistema com meus dados pessoais para que eu possa usar o marketplace como cliente.

**Why P1**: Sem registro nao existe usuario — eh o ponto de entrada de todo o sistema.

**Acceptance Criteria**:

1. WHEN visitante envia email, CPF (11 digitos), nome (min 2 chars) e senha THEN sistema SHALL criar usuario com role CLIENT, ClientProfile, status ativo e retornar o UserId gerado
2. WHEN visitante envia email que ja esta cadastrado THEN sistema SHALL rejeitar o registro com erro `EmailAlreadyExistsException`
3. WHEN visitante envia CPF que ja esta cadastrado THEN sistema SHALL rejeitar o registro com erro `CpfAlreadyExistsException`
4. WHEN visitante envia senha THEN sistema SHALL armazenar apenas o hash, nunca a senha em texto plano (algoritmo de hash eh detalhe de infra)
5. WHEN visitante envia email sem "@" THEN sistema SHALL rejeitar com erro de validacao
6. WHEN visitante envia CPF com menos ou mais de 11 digitos THEN sistema SHALL rejeitar com erro de validacao
7. WHEN visitante envia nome com menos de 2 caracteres THEN sistema SHALL rejeitar com erro de validacao
8. WHEN visitante envia campo obrigatorio vazio ou nulo THEN sistema SHALL rejeitar com erro de validacao

**Independent Test**: Enviar POST /api/users com dados validos e verificar que retorna 201 com UserId. Consultar banco e confirmar que usuario existe com role CLIENT e senha em hash.

---

### P1: Persistencia de usuario no banco ⭐ MVP

**User Story**: Como sistema, preciso persistir usuarios no PostgreSQL para que os dados sobrevivam entre reinicializacoes.

**Why P1**: Sem persistencia, o registro nao tem efeito. JdbcUserRepository esta como scaffold e precisa ser implementado.

**Acceptance Criteria**:

1. WHEN usuario eh salvo THEN sistema SHALL persistir todos os campos na tabela `users` (id, email, cpf, password_hash, name, created_at, active)
2. WHEN usuario eh salvo com roles THEN sistema SHALL persistir roles na tabela `user_roles`
3. WHEN usuario eh salvo com ClientProfile THEN sistema SHALL persistir na tabela `client_profiles`
4. WHEN sistema busca usuario por ID THEN SHALL retornar o agregado completo (User + roles + profiles)
5. WHEN sistema busca usuario por email THEN SHALL retornar o agregado completo
6. WHEN sistema busca usuario por CPF THEN SHALL retornar o agregado completo
7. WHEN usuario nao existe THEN findById/findByEmail/findByCpf SHALL retornar Optional.empty()
8. WHEN migration Liquibase executa THEN SHALL criar tabelas users, user_roles, client_profiles, provider_profiles

**Independent Test**: Executar teste de integracao com Testcontainers que salva e recupera usuario do banco real.

---

### P1: API REST de registro ⭐ MVP

**User Story**: Como frontend/cliente HTTP, quero um endpoint REST para registrar usuarios para que o sistema seja acessivel via HTTP.

**Why P1**: Sem endpoint, a funcionalidade nao eh acessivel externamente.

**Acceptance Criteria**:

1. WHEN POST /api/users com body JSON valido THEN sistema SHALL retornar 201 Created com UserId no body
2. WHEN POST /api/users com email duplicado THEN sistema SHALL retornar 409 Conflict com mensagem de erro
3. WHEN POST /api/users com CPF duplicado THEN sistema SHALL retornar 409 Conflict com mensagem de erro
4. WHEN POST /api/users com dados invalidos (email sem @, CPF errado, nome curto) THEN sistema SHALL retornar 400 Bad Request com detalhes do erro
5. WHEN POST /api/users com body ausente ou malformado THEN sistema SHALL retornar 400 Bad Request

**Independent Test**: Chamar endpoint via curl/Postman e verificar responses HTTP corretos para cada cenario.

---

### P2: Publicacao de evento UserRegisteredEvent

**User Story**: Como sistema, quero publicar um evento quando um usuario se registra para que outros modulos possam reagir (ex: envio de email de boas-vindas no futuro).

**Why P2**: Eventos sao parte da arquitetura Spring Modulith, mas nenhum consumidor existe ainda no M1. Importante estabelecer o padrao.

**Acceptance Criteria**:

1. WHEN usuario eh registrado com sucesso THEN sistema SHALL publicar `UserRegisteredEvent` contendo userId, email, name e timestamp
2. WHEN registro falha (validacao, duplicidade) THEN sistema SHALL NOT publicar evento

**Independent Test**: Teste unitario que verifica publicacao do evento apos registro bem-sucedido via Spring ApplicationEventPublisher.

---

## Edge Cases

- WHEN email contem espacos em branco antes/depois THEN sistema SHALL tratar com trim antes da validacao
- WHEN CPF contem pontuacao (ex: 123.456.789-00) THEN sistema SHALL aceitar apenas digitos puros (11 digitos numericos) — rejeitar com pontuacao
- WHEN dois registros simultaneos tentam o mesmo email THEN sistema SHALL garantir unicidade via constraint no banco (apenas um sucede)
- WHEN dois registros simultaneos tentam o mesmo CPF THEN sistema SHALL garantir unicidade via constraint no banco (apenas um sucede)
- WHEN senha eh extremamente longa (>1000 chars) THEN sistema SHALL aceitar (limites do algoritmo de hash sao detalhe de infra)

---

## Domain Invariants (aggregate User)

Invariantes que o agregado `User` DEVE garantir em qualquer momento. Qualquer operacao que viole um invariante DEVE falhar antes de mutar o estado.

| Invariante | Descricao | Enforced em |
| --- | --- | --- |
| Email valido | Email sempre atende ao formato definido pelo VO `Email` | VO `Email.of(...)` |
| CPF valido | CPF sempre tem 11 digitos numericos | VO `Cpf.of(...)` |
| Nome valido | Nome tem pelo menos 2 caracteres | VO `UserName.of(...)` |
| Senha nunca em texto plano | Apenas `PasswordHash` eh armazenado no agregado | VO `PasswordHash` |
| Estado ativo eh pre-condicao de mutacao | Qualquer operacao de mutacao (trocar senha, criar perfil de prestador, etc.) exige `active=true` — excecao: desativacao (idempotente) | Metodos do agregado `User` |
| Perfil de prestador unico | Um User nao pode ter mais de um `ProviderProfile` | `User.createProviderProfile(...)` |
| Role consistente com perfil | Ao adicionar `ProviderProfile`, role `PROVIDER` eh incluido automaticamente | `User.createProviderProfile(...)` |

**Observacao:** Esses invariantes sao validados no dominio (VOs e metodos do agregado). Use cases confiam no agregado — nao duplicam validacao de invariantes.

---

## Requirement Traceability

| Requirement ID | Story                     | Phase      | Status  |
| -------------- | ------------------------- | ---------- | ------- |
| REG-01         | P1: Registro de usuario   | Implement  | Partial |
| REG-02         | P1: Unicidade email       | Implement  | Partial |
| REG-03         | P1: Unicidade CPF         | Implement  | Partial |
| REG-04         | P1: Hash de senha         | Implement  | Partial |
| REG-05         | P1: Validacao de inputs   | Implement  | Partial |
| REG-06         | P1: Persistencia banco    | -          | Pending |
| REG-07         | P1: Busca por ID/email/CPF| -          | Pending |
| REG-08         | P1: Migration Liquibase   | -          | Pending |
| REG-09         | P1: API POST /api/users   | -          | Pending |
| REG-10         | P1: Error handling HTTP   | -          | Pending |
| REG-11         | P2: UserRegisteredEvent   | -          | Pending |

**Status:** REG-01 a REG-05 tem logica de dominio e use case implementados, mas sem persistencia real (repository eh scaffold) e sem API REST. 6 de 11 pendentes.

**Coverage:** 11 total, 0 mapped to tasks, 11 unmapped

---

## Success Criteria

- [ ] Usuario registrado persiste no banco e pode ser recuperado por ID, email ou CPF
- [ ] Testes de integracao com Testcontainers passam para todos os cenarios de registro
- [ ] Endpoint REST retorna status codes corretos (201, 400, 409)
- [ ] Nenhuma senha em texto plano existe no banco de dados

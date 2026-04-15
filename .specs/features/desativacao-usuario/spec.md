# Desativacao de Usuario - Specification

## Problem Statement

Usuarios precisam poder desativar suas contas e trocar suas senhas. A desativacao (soft delete) preserva dados historicossem remover registros , e a troca de senha eh essencial para seguranca da conta. Ambas operacoes sao fundamentais para gestao do ciclo de vida do usuario.

## Goals

- [ ] Usuario pode desativar sua conta (soft delete — flag active=false)
- [ ] Usuario pode trocar sua senha de forma segura (validando senha atual)
- [ ] Operacoes persistem no banco de dados
- [ ] APIs REST disponiveis para ambas operacoes

## Out of Scope

| Feature                       | Reason                                              |
| ----------------------------- | --------------------------------------------------- |
| Exclusao permanente de dados  | Soft delete eh suficiente — LGPD pode exigir depois |
| Reativacao de conta           | Pode ser adicionado depois — foco em desativacao    |
| Recuperacao de senha (forgot) | Feature separada com fluxo de email                 |
| Bloqueio por tentativas erradas | Complexidade desnecessaria para v1                |
| Historico de senhas           | Over-engineering para projeto de estudo             |
| Notificacao de desativacao    | Sem modulo de notificacao no v1                     |

---

## User Stories

### P1: Desativacao de conta ⭐ MVP

**User Story**: Como usuario autenticado, quero desativar minha conta para que eu nao apareca mais no sistema caso nao queira mais usar o marketplace.

**Why P1**: Gestao basica de ciclo de vida do usuario — essencial para qualquer plataforma.

**Acceptance Criteria**:

1. WHEN usuario autenticado (userId extraido do JWT via `@AuthenticationPrincipal`) envia request de desativacao THEN sistema SHALL setar active=false e persistir no banco
2. WHEN userId do JWT nao corresponde a um usuario existente THEN sistema SHALL rejeitar com erro `UserNotFoundException`
3. WHEN usuario ja esta desativado THEN sistema SHALL aceitar a operacao sem erro (idempotente — unica excecao a invariante de `active=true` para mutacoes)
4. WHEN usuario eh desativado THEN sistema SHALL preservar todos os dados (soft delete, nao remove registros)
5. WHEN request nao tem JWT valido THEN sistema SHALL rejeitar com 401 Unauthorized (nao eh possivel desativar conta de outro usuario)

**Independent Test**: Desativar usuario existente (usando JWT valido) e verificar no banco que active=false. Desativar novamente e verificar que nao ha erro.

---

### P1: Troca de senha ⭐ MVP

**User Story**: Como usuario autenticado, quero trocar minha senha informando a senha atual e a nova para manter minha conta segura.

**Why P1**: Seguranca basica da conta — usuario precisa poder atualizar sua senha.

**Acceptance Criteria**:

1. WHEN usuario autenticado (userId extraido do JWT via `@AuthenticationPrincipal`) envia senha atual correta e nova senha THEN sistema SHALL atualizar o hash da senha no banco
2. WHEN senha atual nao confere com o hash armazenado THEN sistema SHALL rejeitar com erro `InvalidPasswordException`
3. WHEN userId do JWT nao corresponde a um usuario existente THEN sistema SHALL rejeitar com erro `UserNotFoundException`
4. WHEN usuario esta desativado (active=false) THEN sistema SHALL rejeitar com `InactiveUserException` — invariante do agregado, aplicado em `User.changePassword()`
5. WHEN nova senha eh fornecida THEN sistema SHALL armazenar apenas o hash, nunca texto plano (algoritmo eh detalhe de infra)
6. WHEN senha atual esta errada THEN sistema SHALL NOT realizar hash da nova senha (fail-fast)
7. WHEN request nao tem JWT valido THEN sistema SHALL rejeitar com 401 Unauthorized (nao eh possivel trocar senha de outro usuario)

**Independent Test**: Trocar senha de usuario autenticado com senha atual correta. Verificar que o novo hash eh diferente do anterior e que login com nova senha funciona.

---

### P1: API REST de desativacao e troca de senha ⭐ MVP

**User Story**: Como frontend/cliente HTTP, quero endpoints REST para desativacao e troca de senha para que as funcionalidades sejam acessiveis via HTTP.

**Why P1**: Sem endpoints, as funcionalidades nao sao acessiveis externamente.

**Acceptance Criteria**:

1. WHEN PATCH /api/users/me/deactivate (com JWT valido) THEN sistema SHALL retornar 204 No Content em caso de sucesso
2. WHEN PATCH /api/users/me/deactivate sem JWT valido THEN sistema SHALL retornar 401 Unauthorized
3. WHEN PATCH /api/users/me/password com body JSON contendo currentPassword e newPassword (com JWT valido) THEN sistema SHALL retornar 204 No Content em caso de sucesso
4. WHEN PATCH /api/users/me/password com senha atual errada THEN sistema SHALL retornar 422 Unprocessable Entity (InvalidPasswordException — entrada semanticamente invalida, nao eh problema de autenticacao)
5. WHEN PATCH /api/users/me/password sem JWT valido THEN sistema SHALL retornar 401 Unauthorized
6. WHEN usuario autenticado esta desativado THEN sistema SHALL retornar 403 Forbidden (InactiveUserException — apenas para troca de senha; desativacao eh idempotente)
7. WHEN PATCH /api/users/me/password com body ausente ou incompleto THEN sistema SHALL retornar 400 Bad Request

**Nota de seguranca**: Endpoints usam o userId extraido do JWT (`@AuthenticationPrincipal`), NAO aceitam userId no path. Isso garante que um usuario nao possa operar na conta de outro.

**Nota sobre status codes**: `InvalidPasswordException` mapeia para 422 (e nao 401) porque o JWT ja autenticou o usuario — o problema eh a senha atual fornecida no body nao bater com o hash armazenado. Isso eh uma invalidacao semantica da entrada, nao falha de autenticacao.

**Independent Test**: Chamar endpoints via curl/Postman e verificar responses HTTP corretos para cada cenario.

---

### P2: Publicacao de eventos de ciclo de vida

**User Story**: Como sistema, quero publicar eventos quando usuario eh desativado ou troca senha para que outros modulos possam reagir no futuro.

**Why P2**: Estabelece padrao de eventos, mas sem consumidor no M1.

**Acceptance Criteria**:

1. WHEN usuario eh desativado com sucesso THEN sistema SHALL publicar `UserDeactivatedEvent` contendo userId e timestamp
2. WHEN senha eh trocada com sucesso THEN sistema SHALL publicar `PasswordChangedEvent` contendo userId e timestamp (sem conteudo da senha)
3. WHEN operacao falha THEN sistema SHALL NOT publicar evento

**Independent Test**: Testes unitarios que verificam publicacao dos eventos apos operacoes bem-sucedidas.

---

## Edge Cases

- WHEN usuario desativado tenta trocar senha THEN sistema SHALL rejeitar com `InactiveUserException` — invariante do agregado em `User.changePassword()` (usuario deve estar ativo para mutacoes)
- WHEN nova senha eh identica a senha atual THEN sistema SHALL aceitar (nao ha restricao contra reutilizacao no v1)
- WHEN nova senha eh vazia ou nula THEN sistema SHALL rejeitar com erro de validacao (PasswordHash.of rejeita blank)
- WHEN desativacao eh chamada multiplas vezes em sequencia THEN sistema SHALL ser idempotente (sem erro, sem efeito colateral) — unica excecao a invariante `active=true` para mutacoes
- WHEN evento `UserDeactivatedEvent` eh publicado THEN sistema SHALL publicar apenas se a desativacao MUDOU o estado (evita eventos duplicados em chamadas idempotentes)

---

## Requirement Traceability

| Requirement ID | Story                        | Phase     | Status  |
| -------------- | ---------------------------- | --------- | ------- |
| DEAC-01        | P1: Desativacao soft delete  | Implement | Partial |
| DEAC-02        | P1: Idempotencia             | Implement | Partial |
| DEAC-03        | P1: Troca de senha           | Implement | Partial |
| DEAC-04        | P1: Validacao senha atual    | Implement | Partial |
| DEAC-05        | P1: Fail-fast senha errada   | Implement | Partial |
| DEAC-06        | P1: Persistencia no banco    | -         | Pending |
| DEAC-07        | P1: API PATCH deactivate     | -         | Pending |
| DEAC-08        | P1: API PATCH password       | -         | Pending |
| DEAC-09        | P1: Error handling HTTP      | -         | Pending |
| DEAC-10        | P2: UserDeactivatedEvent     | -         | Pending |
| DEAC-11        | P2: PasswordChangedEvent     | -         | Pending |

**Status:** DEAC-01 a DEAC-05 tem logica de dominio e use case implementados, mas sem persistencia real e sem API REST. 6 de 11 pendentes.

**Coverage:** 11 total, 0 mapped to tasks, 11 unmapped

---

## Success Criteria

- [ ] Usuario desativado tem active=false no banco e operacao eh idempotente
- [ ] Troca de senha persiste novo hash e rejeita senha atual incorreta
- [ ] Testes de integracao com Testcontainers passam para todos os cenarios
- [ ] Endpoints REST retornam status codes corretos (204, 400, 401, 404)
- [ ] Nenhuma senha em texto plano transita ou persiste no sistema

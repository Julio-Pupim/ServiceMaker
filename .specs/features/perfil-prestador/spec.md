# Perfil de Prestador - Specification

## Problem Statement

Usuarios registrados como clientes precisam poder se tornar prestadores de servico para oferecer seus servicos no marketplace. O perfil de prestador eh o que habilita um usuario a aparecer em buscas, cadastrar servicos e receber agendamentos nos milestones seguintes.

## Goals

- [ ] Usuario existente (CLIENT) pode criar um perfil de prestador
- [ ] Sistema garante que um usuario so pode ter UM perfil de prestador
- [ ] Role PROVIDER eh adicionada automaticamente ao criar perfil
- [ ] Dados do perfil persistem no banco de dados
- [ ] API REST disponivel para criacao de perfil de prestador

## Out of Scope

| Feature                           | Reason                                                   |
| --------------------------------- | -------------------------------------------------------- |
| Edicao de perfil de prestador     | Pode ser adicionado depois — v1 foca em criacao          |
| Upload de portfolio/fotos         | Complexidade desnecessaria para MVP                      |
| Verificacao/aprovacao de prestador| Sem fluxo de moderacao no v1                             |
| Busca de prestadores              | Sera tratado no modulo Services/Search                   |
| Rating/reviews                    | Modulo separado (v2)                                     |
| Categorias do prestador           | Sera tratado em M2 (Catalogo de Servicos)                |

---

## User Stories

### P1: Criacao de perfil de prestador ⭐ MVP

**User Story**: Como usuario registrado (cliente), quero criar um perfil de prestador com uma descricao para que eu possa oferecer meus servicos no marketplace.

**Why P1**: Sem perfil de prestador, nao ha lado de oferta no marketplace. Eh pre-requisito para M2 (Servicos).

**Acceptance Criteria**:

1. WHEN usuario autenticado (userId extraido do JWT) envia description THEN sistema SHALL criar ProviderProfile com rating=0, reviewCount=0, createdAt=now e adicionar role PROVIDER ao usuario
2. WHEN usuario ja possui perfil de prestador THEN sistema SHALL rejeitar com erro `IllegalStateException` ("User already has a provider profile") — invariante do agregado
3. WHEN userId extraido do JWT nao existe THEN sistema SHALL rejeitar com erro `UserNotFoundException`
4. WHEN usuario esta desativado (active=false) THEN sistema SHALL rejeitar com `InactiveUserException` — invariante do agregado, aplicado em `User.createProviderProfile()`
5. WHEN perfil eh criado THEN sistema SHALL manter a role CLIENT existente (usuario fica com CLIENT + PROVIDER)
6. WHEN perfil eh criado THEN sistema SHALL persistir na tabela `provider_profiles` e atualizar `user_roles`

**Independent Test**: Enviar request para criar perfil de prestador para usuario existente. Verificar que usuario agora tem roles CLIENT + PROVIDER e ProviderProfile no banco.

---

### P1: API REST de criacao de perfil ⭐ MVP

**User Story**: Como frontend/cliente HTTP, quero um endpoint REST para criar perfil de prestador para que a funcionalidade seja acessivel via HTTP.

**Why P1**: Sem endpoint, a funcionalidade nao eh acessivel externamente.

**Acceptance Criteria**:

1. WHEN POST /api/users/me/provider-profile (userId extraido do JWT via @AuthenticationPrincipal) com body JSON contendo description THEN sistema SHALL retornar 201 Created
2. WHEN request sem JWT valido THEN sistema SHALL retornar 401 Unauthorized
3. WHEN POST para usuario autenticado que ja tem perfil THEN sistema SHALL retornar 409 Conflict
4. WHEN usuario do JWT esta desativado THEN sistema SHALL retornar 403 Forbidden (InactiveUserException)
5. WHEN POST com body ausente ou description vazia THEN sistema SHALL retornar 400 Bad Request

**Independent Test**: Chamar endpoint via curl/Postman e verificar responses HTTP corretos para cada cenario.

---

### P2: Publicacao de evento ProviderProfileCreatedEvent

**User Story**: Como sistema, quero publicar um evento quando um perfil de prestador eh criado para que outros modulos possam reagir (ex: indexacao para busca futura).

**Why P2**: Estabelece padrao de comunicacao entre modulos, mas sem consumidor no M1.

**Acceptance Criteria**:

1. WHEN perfil de prestador eh criado com sucesso THEN sistema SHALL publicar `ProviderProfileCreatedEvent` contendo userId, description e timestamp
2. WHEN criacao falha THEN sistema SHALL NOT publicar evento

**Independent Test**: Teste unitario que verifica publicacao do evento apos criacao bem-sucedida.

---

## Edge Cases

- WHEN usuario desativado (active=false) tenta criar perfil de prestador THEN sistema SHALL rejeitar com `InactiveUserException` (invariante do agregado — aplicado em `User.createProviderProfile()`)
- WHEN description eh muito longa (>5000 chars) THEN sistema SHALL aceitar (sem limite definido no v1 — constraint do banco limita)
- WHEN description contem apenas espacos em branco THEN sistema SHALL rejeitar com erro de validacao

---

## Requirement Traceability

| Requirement ID | Story                          | Phase     | Status  |
| -------------- | ------------------------------ | --------- | ------- |
| PROV-01        | P1: Criacao de perfil          | Implement | Partial |
| PROV-02        | P1: Guarda perfil duplicado    | Implement | Partial |
| PROV-03        | P1: Role PROVIDER adicionada   | Implement | Partial |
| PROV-04        | P1: Persistencia no banco      | -         | Pending |
| PROV-05        | P1: API POST provider-profile  | -         | Pending |
| PROV-06        | P1: Error handling HTTP        | -         | Pending |
| PROV-07        | P2: ProviderProfileCreatedEvent| -         | Pending |

**Status:** PROV-01 a PROV-03 tem logica de dominio e use case implementados, mas sem persistencia real e sem API REST. 4 de 7 pendentes.

**Coverage:** 7 total, 0 mapped to tasks, 7 unmapped

---

## Success Criteria

- [ ] Perfil de prestador persiste no banco e usuario atualizado com role PROVIDER
- [ ] Testes de integracao com Testcontainers passam para criacao e guarda de duplicidade
- [ ] Endpoint REST retorna status codes corretos (201, 404, 409, 400)
- [ ] Usuario com perfil de prestador mantem role CLIENT original

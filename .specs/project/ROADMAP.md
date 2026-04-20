# Roadmap

**Current Milestone:** M1 - Fundacao (COMPLETE) → M2 - Catalogo de Servicos (Next)
**Status:** M1 Complete

---

## M1 - Fundacao (Users + Auth)

**Goal:** Cadastro completo de usuarios e prestadores funcionando com testes, protegidos por autenticacao JWT

### Features

**Autenticacao JWT** - PLANNED → (spec a criar)

- Endpoint POST /api/auth/login (email + senha -> access token)
- JWT filter na cadeia Spring Security
- JwtService (geracao, validacao, extracao de userId)
- @AuthenticationPrincipal expõe UserId nas rotas protegidas
- Base para proteger endpoints sensiveis (troca de senha, desativacao, criacao de perfil)

**Cadastro de Usuario** - SPECIFIED → [spec](./../features/cadastro-usuario/spec.md)

- Registro de cliente com email, CPF, nome, senha (REG-01..05)
- Persistencia JDBC + migration Liquibase (REG-06..08)
- API REST POST /api/users (REG-09..10)
- Evento UserRegisteredEvent (REG-11)

**Perfil de Prestador** - SPECIFIED → [spec](./../features/perfil-prestador/spec.md)

- Criacao de perfil com descricao (PROV-01..03)
- Persistencia no banco (PROV-04)
- API REST POST /api/users/{id}/provider-profile (PROV-05..06)
- Evento ProviderProfileCreatedEvent (PROV-07)

**Desativacao de Usuario** - SPECIFIED → [spec](./../features/desativacao-usuario/spec.md)

- Soft delete / desativacao de conta (DEAC-01..02)
- Troca de senha segura (DEAC-03..05)
- Persistencia no banco (DEAC-06)
- APIs REST PATCH deactivate + password — userId extraido do JWT (@AuthenticationPrincipal), nao do path (DEAC-07..09)
- Eventos UserDeactivatedEvent + PasswordChangedEvent (DEAC-10..11)

---

## M2 - Catalogo de Servicos

**Goal:** Prestadores podem cadastrar e gerenciar seus servicos

### Features

**Cadastro de Servicos** - PLANNED

- Prestador cria servico com nome, descricao, preco, duracao
- Categorias de servico
- Ativacao/desativacao de servico
- Evento: ProviderServiceCreatedEvent, ProviderServiceUpdatedEvent

**Categorias** - PLANNED

- CRUD de categorias de servico
- Associacao servico <-> categoria

---

## M3 - Agenda e Disponibilidade

**Goal:** Prestadores definem sua disponibilidade para agendamentos

### Features

**Gestao de Agenda** - PLANNED

- Prestador define horarios disponiveis (dias da semana, faixas de horario)
- Bloqueio de horarios especificos (ferias, folgas)
- Consulta de disponibilidade por prestador

---

## M4 - Agendamento

**Goal:** Clientes podem agendar servicos com prestadores

### Features

**Agendamento de Servico** - PLANNED

- Cliente seleciona prestador + servico + horario disponivel
- Confirmacao de agendamento
- Cancelamento de agendamento
- Eventos: AppointmentScheduledEvent, AppointmentCancelledEvent

**Finalizacao de Servico** - PLANNED

- Prestador marca servico como concluido
- Evento: ServiceCompletedEvent

---

## M5 - Pagamento

**Goal:** Fluxo de pagamento integrado ao agendamento

### Features

**Processamento de Pagamento** - PLANNED

- Integracao com gateway de pagamento (a definir — opcao de baixo custo)
- Pagamento vinculado ao agendamento
- Evento: PaymentProcessedEvent

---

## Future Considerations

- Sistema de avaliacoes/reviews
- Sistema de propostas (prestador envia proposta para pedido do cliente)
- Busca e matching inteligente de prestadores
- Notificacoes (email, push)
- Dashboard administrativo
- Mobile app
- Real-time chat

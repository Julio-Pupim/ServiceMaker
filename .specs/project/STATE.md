# State

**Last Updated:** 2026-04-14
**Current Work:** M1 - Fundacao (Users module) - Phase 2 in progress. T4 DONE. Next: T5 (JdbcUserRepository + integration tests)

---
**EXCLUSIVE CURRENT FOCUS:** We are working ONLY on the module listed as "IN PROGRESS" (Currently: `Users` - M1).
## Recent Decisions (Last 60 days)

### AD-001: Fluxo simplificado sem propostas no v1 (2026-04-07)

**Decision:** v1 segue fluxo direto: cliente agenda diretamente com prestador (sem sistema de pedidos/propostas)
**Reason:** Simplifica o MVP — propostas e matching adicionam complexidade sem valor imediato para estudo
**Trade-off:** Perde flexibilidade de negociacao entre cliente e prestador
**Impact:** Modules ServiceRequests e Proposals ficam para v2. Fluxo: buscar prestador -> ver disponibilidade -> agendar -> pagar

---

## Active Blockers

_None_

---

## Resolved Blockers

### BLK-001: Ambiente local com Java 21, pom exige Java 25 (resolvido 2026-04-14)
**Resolucao:** usuario instalou JDK 25 local. `./mvnw compile` e `./mvnw test` rodam sem flags.

---

## Lessons Learned

_None yet_

---

## Quick Tasks Completed

| #   | Description | Date | Commit | Status |
| --- | ----------- | ---- | ------ | ------ |

---

## Deferred Ideas

- [ ] Sistema de propostas (prestador envia proposta para pedido) — Captured during: project init
- [ ] Busca inteligente / matching de prestadores — Captured during: project init
- [ ] Sistema de reviews/avaliacoes — Captured during: project init
- [ ] Notificacoes (email, push) — Captured during: project init

---

## Todos

- [ ] Finalizar testes do modulo Users (M1)
- [ ] Definir gateway de pagamento de baixo custo para M5
- [ ] Phase 2: T5 (JdbcUserRepository + integration tests)

---

## Preferences

**Model Guidance Shown:** never

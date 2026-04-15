# State

**Last Updated:** 2026-04-14
**Current Work:** M1 - Fundacao (Users module) - Phase 1 DONE (T1, T2, T3 merged). Next: Phase 2 (T4 → T5)

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

### BLK-001: Ambiente local com Java 21, pom exige Java 25 (2026-04-14)
**Impact:** `./mvnw compile` e `./mvnw test` falham sem `-Dmaven.compiler.release=21`.
**Workaround:** executar com `-Dmaven.compiler.release=21` (agentes de Phase 1 usaram isso com sucesso).
**Resolucao:** instalar JDK 25 localmente OU ajustar pom.xml para Java 21. Decidir antes de M2.

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
- [ ] Phase 2: T4 (UserEntityMapper) → T5 (JdbcUserRepository + integration tests)
- [ ] Resolver BLK-001 (Java 21 vs Java 25) antes de M2

---

## Preferences

**Model Guidance Shown:** never

# serviceMaker

**Vision:** Marketplace de servicos que conecta clientes a prestadores locais de qualquer nicho, permitindo buscar, agendar e pagar por servicos de forma simples.
**For:** Clientes que precisam de servicos locais (eletricistas, professores particulares, diaristas, etc.) e prestadores autonomos que querem divulgar seus servicos e gerenciar sua agenda.
**Solves:** Dificuldade de encontrar prestadores confiaveis e de prestadores gerenciarem agendamentos e disponibilidade.

## Goals

- Permitir que clientes encontrem e agendem servicos locais com fluxo completo (busca -> agendamento -> pagamento)
- Permitir que prestadores cadastrem seus servicos, definam disponibilidade e recebam agendamentos
- Manter arquitetura modular e limpa como projeto de estudo de DDD + Spring Modulith

## Tech Stack

**Core:**

- Framework: Spring Boot 4.0.3 + Spring Modulith
- Language: Java 25
- Database: PostgreSQL

**Key dependencies:**

- Spring Data JDBC (persistence)
- Liquibase (migrations)
- Spring Security + BCrypt (auth)
- Testcontainers (integration tests)
- springdoc-openapi (API docs)

## Scope

**v1 includes:**

- Cadastro de usuario (cliente)
- Cadastro de prestador (provider profile)
- Cadastro de servicos do prestador
- Cadastro da agenda/disponibilidade do prestador
- Agendamento de servicos
- Pagamento

**Explicitly out of scope:**

- Mobile app
- Real-time chat
- Admin dashboard
- Multi-language support (portugues apenas)
- Sistema de avaliacoes/reviews (v2)
- Sistema de propostas (v2)
- Notificacoes push

## Constraints

- **Team:** Desenvolvedor solo
- **Purpose:** Projeto de estudo (DDD, Spring Modulith, arquitetura limpa)
- **Budget:** Baixo — preferir solucoes open-source e infra minima
- **Deploy:** Sem target definido ainda

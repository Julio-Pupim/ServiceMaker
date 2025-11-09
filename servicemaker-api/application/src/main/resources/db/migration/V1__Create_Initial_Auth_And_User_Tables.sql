-- Ativa a extensão "pgcrypto" se ela ainda não estiver ativa.
-- É uma boa prática para se trabalhar com UUIDs e criptografia no Postgres.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

---
-- Tabela de Usuários (usuarios)
-- Armazena o núcleo de dados do usuário.
---
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,

    -- Timestamps com fuso horário (melhor prática no Postgres)
    created_at TIMESTAMPTZ NOT NULL DEFAULT (now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (now())
);

---
-- Tabela de Roles (usuario_roles)
-- Mapeia a List<Role> da entidade UsuarioEntity (@ElementCollection)
-- Permite que um usuário tenha múltiplas roles.
---
CREATE TABLE IF NOT EXISTS usuario_roles (
    usuario_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,

    -- Chave primária composta: um usuário não pode ter a mesma role duas vezes.
    CONSTRAINT pk_usuario_roles PRIMARY KEY (usuario_id, role),

    -- Se um usuário for deletado, suas roles são deletadas em cascata.
    CONSTRAINT fk_usuario_roles_usuario
        FOREIGN KEY(usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

---
-- Tabela de Refresh Tokens (refresh_tokens)
-- Armazena os refresh tokens para o módulo 'auth'.
---
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    token_hash VARCHAR(512) NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false,
    device_info VARCHAR(255),

    -- Se um usuário for deletado, todos os seus tokens são revogados/deletados.
    CONSTRAINT fk_refresh_tokens_usuario
        FOREIGN KEY(user_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

---
-- Índices para Otimização de Performance
---
-- Índice na tabela de roles para buscas rápidas de roles de um usuário.
CREATE INDEX IF NOT EXISTS idx_usuario_roles_usuario_id ON usuario_roles(usuario_id);

-- Índices na tabela de refresh tokens para buscas por usuário e por data de expiração.
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
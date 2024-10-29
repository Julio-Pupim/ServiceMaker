alter table if exists usuario
    add column if not exists id_contato bigint,
    add column if not exists id_agenda  bigint,
    ADD COLUMN role                     varchar(20) NOT NULL;
DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1
                       FROM information_schema.table_constraints
                       WHERE constraint_type = 'FOREIGN KEY'
                         AND table_name = 'usuario'
                         AND constraint_name = 'fk_usuario_on_id_agenda') THEN
            ALTER TABLE usuario
                ADD CONSTRAINT fk_usuario_on_id_agenda FOREIGN KEY (id_agenda) REFERENCES agenda (id);
        END IF;
    END
$$;

DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1
                       FROM information_schema.table_constraints
                       WHERE constraint_type = 'FOREIGN KEY'
                         AND table_name = 'usuario'
                         AND constraint_name = 'fk_usuario_on_id_contato') THEN
            ALTER TABLE usuario
                ADD CONSTRAINT fk_usuario_on_id_contato FOREIGN KEY (id_contato) REFERENCES contato (id);
        END IF;

    END
$$;

ALTER TABLE IF EXISTS USUARIO
    ALTER COLUMN cpf DROP NOT NULL,
    ALTER COLUMN prestador TYPE varchar(10),
    ALTER COLUMN prestador SET NOT NULL;


ALTER TABLE IF EXISTS USUARIO
    RENAME COLUMN prestador to tipo_usuario;


ALTER TABLE IF EXISTS agenda
    DROP CONSTRAINT IF EXISTS agenda_id_prestador_fkey,
    ADD CONSTRAINT agenda_id_prestador_fkey FOREIGN KEY (id_prestador) REFERENCES usuario (id);

ALTER TABLE avaliacao
    DROP CONSTRAINT IF EXISTS avaliacao_id_prestador_fkey,
    ADD CONSTRAINT avaliacao_id_prestador_fkey FOREIGN KEY (id_prestador) REFERENCES usuario (id);

ALTER TABLE certificado
    DROP CONSTRAINT IF EXISTS certificado_id_prestador_fkey,
    ADD CONSTRAINT certificado_id_prestador_fkey FOREIGN KEY (id_prestador) REFERENCES usuario (id);

ALTER TABLE servico
    DROP CONSTRAINT IF EXISTS servico_id_prestador_fkey,
    ADD CONSTRAINT servico_id_prestador_fkey FOREIGN KEY (id_prestador) REFERENCES usuario (id);

DROP TABLE IF EXISTS prestador;

ALTER TABLE IF EXISTS contato
    DROP COLUMN id_usuario;

ALTER TABLE IF EXISTS CONTATO
    DROP COLUMN celular,
    ALTER COLUMN telefone SET NOT NULL;

ALTER TABLE IF EXISTS usuario
    ALTER COLUMN senha TYPE TEXT;

ALTER TABLE IF EXISTS ENDERECO
    ALTER COLUMN tipo TYPE TEXT;

ALTER TABLE IF EXISTS avaliacao
    ADD COLUMN IF NOT EXISTS avaliacao_prestador bigint;

ALTER TABLE IF EXISTS RESERVA
    add column if not exists id_prestador bigint;

DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1
                       FROM information_schema.table_constraints
                       WHERE constraint_type = 'FOREIGN KEY'
                         AND table_name = 'reserva'
                         AND constraint_name = 'reserva_prestador_fk') THEN
            ALTER TABLE reserva
                ADD CONSTRAINT reserva_prestador_fk FOREIGN KEY (id_prestador) REFERENCES usuario (id);
        END IF;
    END
$$;

ALTER TABLE prestador
    DROP CONSTRAINT agenda_fk;

ALTER TABLE usuario
    ADD dtype VARCHAR(31);

ALTER TABLE usuario
    ADD id_agenda BIGINT;

ALTER TABLE usuario
    ADD id_contato BIGINT;

ALTER TABLE usuario
    ADD role SMALLINT;

UPDATE usuario
SET DTYPE = 'Usuario'
WHERE DTYPE is null;

ALTER TABLE usuario
    ALTER COLUMN id_agenda SET NOT NULL;

ALTER TABLE usuario
    ALTER COLUMN id_contato SET NOT NULL;

ALTER TABLE usuario
    ADD CONSTRAINT uc_usuario_id_agenda UNIQUE (id_agenda);

ALTER TABLE usuario
    ADD CONSTRAINT uc_usuario_id_contato UNIQUE (id_contato);

ALTER TABLE usuario
    ADD CONSTRAINT FK_USUARIO_ON_ID_AGENDA FOREIGN KEY (id_agenda) REFERENCES agenda (id);

ALTER TABLE usuario
    ADD CONSTRAINT FK_USUARIO_ON_ID_CONTATO FOREIGN KEY (id_contato) REFERENCES contato (id);

DROP TABLE prestador CASCADE;

ALTER TABLE usuario
    ALTER COLUMN cpf TYPE VARCHAR(255) USING (cpf::VARCHAR(255));

ALTER TABLE usuario
    ALTER COLUMN cpf DROP NOT NULL;

ALTER TABLE usuario
    ADD CONSTRAINT uc_usuario_id_agenda UNIQUE (id);

ALTER TABLE usuario
    ALTER COLUMN nome TYPE VARCHAR(255) USING (nome::VARCHAR(255));

ALTER TABLE usuario
    ALTER COLUMN prestador DROP NOT NULL;

ALTER TABLE usuario
    ALTER COLUMN senha TYPE VARCHAR(255) USING (senha::VARCHAR(255));
alter table if exists usuario
    add column if not exists id_contato bigint,
    add column if not exists id_agenda  bigint;

ALTER TABLE if exists usuario
    ADD CONSTRAINT uc_usuario_id_agenda UNIQUE (id_agenda);

ALTER TABLE if exists usuario
    ADD CONSTRAINT uc_usuario_id_contato UNIQUE (id_contato);

ALTER TABLE if exists usuario
    ADD CONSTRAINT FK_USUARIO_ON_ID_AGENDA FOREIGN KEY (id_agenda) REFERENCES agenda (id);

ALTER TABLE if exists usuario
    ADD CONSTRAINT FK_USUARIO_ON_ID_CONTATO FOREIGN KEY (id_contato) REFERENCES contato (id);
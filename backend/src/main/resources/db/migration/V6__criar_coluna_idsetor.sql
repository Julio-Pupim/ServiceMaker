ALTER TABLE IF EXISTS usuario
ADD COLUMN IF NOT EXISTS id_setor bigint;

ALTER TABLE IF EXISTS usuario
    ADD CONSTRAINT usuario_setor_fk FOREIGN KEY (id_setor) REFERENCES setor (id);

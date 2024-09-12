-- Esta é a tabela para cadastrar contatos

-- DROP TABLE IF EXISTS public.contato;

CREATE TABLE IF NOT EXISTS public.contato
(
    id_contato integer NOT NULL,
    telefone character varying(13) COLLATE pg_catalog."default",
    celular character varying(13) COLLATE pg_catalog."default" NOT NULL,
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    id_usuario integer,
    CONSTRAINT contato_pkey PRIMARY KEY (id_contato),
    CONSTRAINT contato_usuario_fk FOREIGN KEY (id_usuario)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.contato
    OWNER to postgres;
    
-- Esta é a tabela para cadastrar agendas de prestadores de serviço

-- DROP TABLE IF EXISTS public.agenda;

CREATE TABLE IF NOT EXISTS public.agenda
(
    id_agenda integer NOT NULL,
    data_inicio date NOT NULL,
    data_fim date NOT NULL,
    disponivel boolean NOT NULL,
    id_prestador integer,
    CONSTRAINT agenda_pkey PRIMARY KEY (id_agenda),
    CONSTRAINT agenda_prestador_fk FOREIGN KEY (id_prestador)
        REFERENCES public.prestador (id_prestador) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.agenda
    OWNER to postgres;
    
-- Esta é a tabela para as avaliações de prestadores e clientes

-- DROP TABLE IF EXISTS public.avaliacao;

CREATE TABLE IF NOT EXISTS public.avaliacao
(
    id_avaliacao integer NOT NULL,
    avaliacao integer NOT NULL,
    comentario_prestador text COLLATE pg_catalog."default",
    comentario_cliente text COLLATE pg_catalog."default",
    id_prestador integer,
    id_cliente integer,
    CONSTRAINT avaliacao_pkey PRIMARY KEY (id_avaliacao),
    CONSTRAINT avaliacao_prestador_fk FOREIGN KEY (id_prestador)
        REFERENCES public.prestador (id_prestador) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT avaliacao_cliente_fk FOREIGN KEY (id_cliente)
        REFERENCES public.cliente (id_cliente) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.avaliacao
    OWNER to postgres;
    
-- Esta é a tabela para cadastrar certificados de prestadores de serviço

-- DROP TABLE IF EXISTS public.certificado;

CREATE TABLE IF NOT EXISTS public.certificado
(
    id_certificado integer NOT NULL,
    nome character varying(50) COLLATE pg_catalog."default" NOT NULL,
    cidade character varying(50) COLLATE pg_catalog."default" NOT NULL,
    horas integer NOT NULL,
    data_emissao date NOT NULL,
    arquivo bytea NOT NULL,
    id_prestador integer,
    CONSTRAINT certificado_pkey PRIMARY KEY (id_certificado),
    CONSTRAINT certificado_prestador_fk FOREIGN KEY (id_prestador)
        REFERENCES public.prestador (id_prestador) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.certificado
    OWNER to postgres;
    
-- Esta é a tabela para cadastrar clientes

-- DROP TABLE IF EXISTS public.cliente;

CREATE TABLE IF NOT EXISTS public.cliente
(
    id_cliente integer NOT NULL,
    CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.cliente
    OWNER to postgres;
    
-- Esta é a tabela para cadastrar cronogramas de trabalho de prestadores

-- DROP TABLE IF EXISTS public.cronograma_trabalho;

CREATE TABLE IF NOT EXISTS public.cronograma_trabalho
(
    id_cronograma integer NOT NULL,
    dia_semana integer NOT NULL,
    hora_inicio timestamp without time zone NOT NULL,
    hora_fim timestamp without time zone NOT NULL,
    id_agenda integer,
    CONSTRAINT cronograma_trabalho_pkey PRIMARY KEY (id_cronograma),
    CONSTRAINT cronograma_agenda_fk FOREIGN KEY (id_agenda)
        REFERENCES public.agenda (id_agenda) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.cronograma_trabalho
    OWNER to postgres;
    
-- Esta é a tabela para cadastrar endereços de usuários

-- DROP TABLE IF EXISTS public.endereco;

CREATE TABLE IF NOT EXISTS public.endereco
(
    id_endereco integer NOT NULL,
    cep character varying(8) COLLATE pg_catalog."default" NOT NULL,
    rua character varying(50) COLLATE pg_catalog."default" NOT NULL,
    numero character varying(5) COLLATE pg_catalog."default",
    complemento character varying(50) COLLATE pg_catalog."default",
    tipo integer NOT NULL,
    id_usuario integer,
    CONSTRAINT endereco_pkey PRIMARY KEY (id_endereco),
    CONSTRAINT endereco_usuario_fk FOREIGN KEY (id_usuario)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.endereco
    OWNER to postgres;
    
-- Esta é a tabela para cadastrar prestadores de serviço

-- DROP TABLE IF EXISTS public.prestador;

CREATE TABLE IF NOT EXISTS public.prestador
(
    id_prestador integer NOT NULL,
    CONSTRAINT prestador_pkey PRIMARY KEY (id_prestador),
    CONSTRAINT prestador_agenda_fk FOREIGN KEY (id_agenda)
        REFERENCES public.agenda (id_agenda) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.prestador
    OWNER to postgres;
    
-- Esta é a tabela para reservas

-- DROP TABLE IF EXISTS public.reserva;

CREATE TYPE status_enum AS ENUM ('pendente', 'confirmada', 'cancelada');

CREATE TABLE IF NOT EXISTS public.reserva
(
    id_reserva integer NOT NULL,
    status status_enum NOT NULL,
    horario_inicio timestamp without time zone NOT NULL,
    horario_fim timestamp without time zone NOT NULL,
    reservado_em timestamp without time zone,
    id_cliente integer,
    id_servico integer,
    id_agenda integer,
    CONSTRAINT reserva_pkey PRIMARY KEY (id_reserva),
    CONSTRAINT reserva_cliente_fk FOREIGN KEY (id_cliente)
        REFERENCES public.cliente (id_cliente) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT reserva_servico_fk FOREIGN KEY (id_servico)
        REFERENCES public.servico (id_servico) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT reserva_agenda_fk FOREIGN KEY (id_agenda)
        REFERENCES public.agenda (id_agenda) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.reserva
    OWNER to postgres;
    
-- Esta é a tabela para cadastrar serviços

-- DROP TABLE IF EXISTS public.servico;

CREATE TABLE IF NOT EXISTS public.servico
(
    id_servico integer NOT NULL,
    descricao character varying(100) COLLATE pg_catalog."default" NOT NULL,
    tempo_servico timestamp without time zone NOT NULL,
    preco numeric NOT NULL,
    id_setor integer,
    id_prestador integer,
    CONSTRAINT servico_pkey PRIMARY KEY (id_servico),
    CONSTRAINT servico_setor_fk FOREIGN KEY (id_setor)
        REFERENCES public.setor (id_setor) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT servico_prestador_fk FOREIGN KEY (id_prestador)
        REFERENCES public.prestador (id_prestador) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.servico
    OWNER to postgres;

-- Esta é a tabela para setores de serviços

-- DROP TABLE IF EXISTS public.setor;

CREATE TABLE IF NOT EXISTS public.setor
(
    id_setor integer NOT NULL,
    descricao text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT setor_pkey PRIMARY KEY (id_setor)
)

-- Esta é a tabela para cadastrar usuários

-- DROP TABLE IF EXISTS public.usuario;

CREATE TABLE IF NOT EXISTS public.usuario
(
    id_usuario integer NOT NULL,
    nome character varying(50) COLLATE pg_catalog."default" NOT NULL,
    cpf character varying(11) COLLATE pg_catalog."default" NOT NULL,
    senha character varying(50) COLLATE pg_catalog."default" NOT NULL,
    prestador boolean NOT NULL,
    CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.usuario
    OWNER to postgres;

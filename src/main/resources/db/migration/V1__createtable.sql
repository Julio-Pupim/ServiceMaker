-- Criação da tabela PRESTADOR
CREATE TABLE PRESTADOR (
    ID SERIAL PRIMARY KEY
);

-- Criação da tabela AGENDA
CREATE TABLE AGENDA (
    ID SERIAL PRIMARY KEY,
    DATA_INICIO TIMESTAMP NOT NULL,
    DATA_FIM TIMESTAMP NOT NULL,
    DISPONIVEL BOOLEAN NOT NULL,
    ID_PRESTADOR INTEGER NOT NULL REFERENCES PRESTADOR(ID)
);

-- Criação da tabela USUARIO
CREATE TABLE USUARIO (
    ID SERIAL PRIMARY KEY,
    NOME VARCHAR(50) NOT NULL,
    CPF VARCHAR(11) NOT NULL UNIQUE,
    SENHA VARCHAR(50) NOT NULL,
    PRESTADOR BOOLEAN NOT NULL
);

-- Criação da tabela AVALIACAO
CREATE TABLE AVALIACAO (
    ID SERIAL PRIMARY KEY,
    AVALIACAO INTEGER NOT NULL,
    COMENTARIO_PRESTADOR VARCHAR(250),
    COMENTARIO_CLIENTE VARCHAR(250),
    ID_CLIENTE INTEGER NOT NULL REFERENCES USUARIO(ID),
    ID_PRESTADOR INTEGER NOT NULL REFERENCES PRESTADOR(ID)
);

-- Criação da tabela CERTIFICADO
CREATE TABLE CERTIFICADO (
    ID SERIAL PRIMARY KEY,
    NOME VARCHAR(50) NOT NULL,
    HORAS INTEGER NOT NULL,
    DATA_EMISSAO DATE NOT NULL,
    ARQUIVO BYTEA,
    ID_PRESTADOR INTEGER NOT NULL REFERENCES PRESTADOR(ID)
);

-- Criação da tabela CRONOGRAMA_TRABALHO
CREATE TABLE CRONOGRAMA_TRABALHO (
    ID SERIAL PRIMARY KEY,
    ID_AGENDA INTEGER NOT NULL REFERENCES AGENDA(ID),
    DIA_SEMANA INTEGER NOT NULL,
    HORA_INICIO TIME NOT NULL,
    HORA_FIM TIME NOT NULL
);

-- Criação da tabela CONTATO
CREATE TABLE CONTATO (
    ID SERIAL PRIMARY KEY,
    TELEFONE VARCHAR(13),
    CELULAR VARCHAR(13),
    EMAIL VARCHAR(50),
    ID_USUARIO INTEGER NOT NULL REFERENCES USUARIO(ID)
);

-- Criação da tabela ENDERECO
CREATE TABLE ENDERECO (
    ID SERIAL PRIMARY KEY,
    CEP VARCHAR(8) NOT NULL,
    RUA VARCHAR(50) NOT NULL,
    NUMERO VARCHAR(5) NOT NULL,
    COMPLEMENTO VARCHAR(50),
    TIPO INTEGER NOT NULL,
    ID_USUARIO INTEGER NOT NULL REFERENCES USUARIO(ID)
);

-- Criação da tabela SETOR
CREATE TABLE SETOR (
    ID SERIAL PRIMARY KEY,
    DESCRICAO TEXT NOT NULL
);


-- Criação da tabela SERVICO
CREATE TABLE SERVICO (
    ID SERIAL PRIMARY KEY,
    ID_SETOR INTEGER NOT NULL REFERENCES SETOR(ID),
    DESCRICAO VARCHAR(100) NOT NULL,
    TEMPO_SERVICO TIME NOT NULL,
    PRECO NUMERIC NOT NULL,
    ID_PRESTADOR INTEGER NOT NULL REFERENCES PRESTADOR(ID)
);

-- Criação da tabela RESERVA
CREATE TABLE RESERVA (
    ID SERIAL PRIMARY KEY,
    ID_CLIENTE INTEGER NOT NULL REFERENCES USUARIO(ID),
    ID_AGENDA INTEGER NOT NULL REFERENCES AGENDA(ID),
    ID_SERVICO INTEGER NOT NULL REFERENCES SERVICO(ID),
    STATUS VARCHAR(50) NOT NULL,
    HORARIO_INICIO TIME NOT NULL,
    HORARIO_FIM TIME NOT NULL,
    RESERVADO_EM TIMESTAMP NOT NULL
);





















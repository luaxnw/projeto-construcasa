CREATE TABLE IF NOT EXISTS clientes (
	id_cliente SERIAL PRIMARY KEY,
	nome VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,
	telefone VARCHAR(20) NOT NULL UNIQUE,
	endereco VARCHAR(50) NOT NULL,
	CREATED_AT TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UPDATED_AT TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
    id_role SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS funcionarios(
    id_funcionario SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    id_role INT NOT NULL,                  
    FOREIGN KEY (id_role) REFERENCES roles(id_role)
);

CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SERIAL PRIMARY KEY, 
    nome VARCHAR(50) NOT NULL UNIQUE,          
    descricao VARCHAR(255)                      
);

CREATE TABLE IF NOT EXISTS unidades_medida (
    id_unidade INT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,          
    sigla VARCHAR(10) NOT NULL UNIQUE,
    tipo_grandeza VARCHAR(20) NOT NULL,
    
    fator_conversao DECIMAL(10, 4) NOT NULL DEFAULT 1.0000 
);

CREATE TABLE IF NOT EXISTS produtos (
    id_produto INT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    id_categoria INT NOT NULL,
    
    preco_base DECIMAL(10, 2) NOT NULL, 
    id_unidade_padrao INT NOT NULL,     
    
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_unidade_padrao) REFERENCES unidades_medida(id_unidade)
);





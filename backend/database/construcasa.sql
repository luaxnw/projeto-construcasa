CREATE TABLE IF NOT EXISTS roles (
    id_role     SERIAL PRIMARY KEY,
    nome        VARCHAR(50) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS unidades_medida (
    id_unidade_medida  SERIAL PRIMARY KEY,
    nome        VARCHAR(50) NOT NULL UNIQUE,
    sigla       VARCHAR(10) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enderecos (
    id_endereco       SERIAL PRIMARY KEY,
    rua               VARCHAR(100) NOT NULL,
    numero            VARCHAR(10)  NOT NULL,          
    bairro            VARCHAR(60)  NOT NULL,
    cidade            VARCHAR(60)  NOT NULL,
    complemento       VARCHAR(100),
    ponto_referencia  VARCHAR(150),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clientes (
    id_cliente   SERIAL PRIMARY KEY,
    nome         VARCHAR(100) NOT NULL,
    cpf_cnpj     VARCHAR(20)  UNIQUE,                 
    email        VARCHAR(100) UNIQUE,                 
    telefone     VARCHAR(20)  NOT NULL UNIQUE,        
    id_endereco  INT REFERENCES enderecos(id_endereco) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS funcionarios (
    id_funcionario  SERIAL PRIMARY KEY,
    nome            VARCHAR(100) NOT NULL,
    cpf             VARCHAR(20)  NOT NULL UNIQUE,   
    senha_hash      VARCHAR(255) NOT NULL,
    cargo           VARCHAR(50)  NOT NULL,            
    id_role         INT NOT NULL REFERENCES roles(id_role),  
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias (
    id_categoria  SERIAL PRIMARY KEY,
    nome          VARCHAR(50) NOT NULL UNIQUE,
    descricao     VARCHAR(255),
    ativa         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produtos (
    id_produto         SERIAL PRIMARY KEY,
    nome               VARCHAR(150) NOT NULL,
    descricao          TEXT,
    id_categoria       INT NOT NULL REFERENCES categorias(id_categoria),
    preco_venda        DECIMAL(10, 2) NOT NULL,        
    id_unidade_medida  INT NOT NULL REFERENCES unidades_medida(id_unidade_medida),
    qtd_estoque        INT NOT NULL DEFAULT 0,
    ativo              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entregadores (
    id_entregador   SERIAL PRIMARY KEY,
    id_funcionario  INT NOT NULL UNIQUE REFERENCES funcionarios(id_funcionario),
    cnh_numero      VARCHAR(11) NOT NULL UNIQUE,
    cnh_categoria   VARCHAR(2)  NOT NULL,
    cnh_validade    DATE NOT NULL,
    disponivel      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS veiculos (
    id_veiculo        SERIAL PRIMARY KEY,
    placa             VARCHAR(7)  NOT NULL UNIQUE,    
    modelo            VARCHAR(60) NOT NULL,
    tipo              VARCHAR(30) NOT NULL,           
    capacidade_carga  DECIMAL(10, 2) NOT NULL,        
    disponivel        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido            SERIAL PRIMARY KEY,
    id_cliente           INT NOT NULL REFERENCES clientes(id_cliente),
    id_funcionario       INT NOT NULL REFERENCES funcionarios(id_funcionario), 
    forma_pagamento      VARCHAR(15) NOT NULL DEFAULT 'pix', 
    tipo_entrega         VARCHAR(10) NOT NULL DEFAULT 'retirada',
    id_endereco_entrega  INT REFERENCES enderecos(id_endereco),
    status_pagamento     VARCHAR(25) NOT NULL DEFAULT 'aguardando_pagamento',
    status_entrega       VARCHAR(20) NOT NULL DEFAULT 'nao_se_aplica',
    status_pedido        VARCHAR(15) NOT NULL DEFAULT 'em_aberto',
    valor_total          DECIMAL(12, 2) NOT NULL DEFAULT 0,   
    observacoes          TEXT,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS itens_pedido (
    id_item_pedido  SERIAL PRIMARY KEY,
    id_pedido       INT NOT NULL REFERENCES pedidos(id_pedido),
    id_produto      INT NOT NULL REFERENCES produtos(id_produto),
    id_unidade_medida      INT NOT NULL REFERENCES unidades_medida(id_unidade_medida),   
    quantidade      DECIMAL(12, 3) NOT NULL,
    preco_unitario  DECIMAL(10, 2) NOT NULL,        
    subtotal        DECIMAL(12, 2) NOT NULL,        
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entregas (
    id_entrega     SERIAL PRIMARY KEY,
    id_pedido      INT NOT NULL UNIQUE REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    id_entregador  INT NOT NULL REFERENCES entregadores(id_entregador),
    id_veiculo     INT NOT NULL REFERENCES veiculos(id_veiculo),
    saida_em       TIMESTAMPTZ,
    entregue_em    TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO roles (nome)
VALUES
    ('ADMIN'),
    ('VENDEDOR')
ON CONFLICT (nome) DO NOTHING;


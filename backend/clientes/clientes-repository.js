const db = require('../database/database');

async function listar() {
    return db.any("SELECT * FROM clientes ORDER BY nome");    
}

async function listarPorID(id) {
    return db.oneOrNoNE("SELECT * FROM clientes WHERE id = $1", [id]);
}

async function listarPorEmail(email) {
    return db.oneOrNoNe("SELECT * FROM clientes WHERE email = $1", [email]);
}

async function listarPorTelefone(telefone) {
    return db.oneOrNoNE("SELECT * FROM clientes WHERE telefone = $1", [telefone]);
}

async function criar(cliente) {
    return db.one(
        "INSERT INTO clientes (nome, email, telefone, endereco) VALUES ($1, $2, $3, $4) RETURNING *",
        [cliente.nome, cliente.email, cliente.telefone, cliente.endereco]
    );
}

module.exports = {
    listar,
    listarPorID,
    listarPorEmail,
    listarPorTelefone,
    criar
};



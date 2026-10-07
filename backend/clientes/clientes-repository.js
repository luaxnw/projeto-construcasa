const db = require('../database/database');

async function listarClientes() {
    return db.any("SELECT * FROM clientes ORDER BY nome");    
}

async function listarClientePorID(id) {
    return db.oneOrNoNE("SELECT * FROM clientes WHERE id = $1", [id]);
}

async function listarClientePorEmail(email) {
    return db.oneOrNoNe("SELECT * FROM clientes WHERE email = $1", [email]);
}

async function listarClientePorTelefone(telefone) {
    return db.oneOrNoNE("SELECT * FROM clientes WHERE telefone = $1", [telefone]);
}

async function criarCliente(cliente) {
    return db.one(
        "INSERT INTO clientes (nome, email, telefone, endereco) VALUES ($1, $2, $3, $4) RETURNING *",
        [cliente.nome, cliente.email, cliente.telefone, cliente.endereco]
    );
}

module.exports = {
    listarClientes,
    listarClientePorID,
    listarClientePorEmail,
    listarClientePorTelefone,
    criarCliente
};



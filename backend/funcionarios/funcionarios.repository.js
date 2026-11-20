const { Funcionario } = require("../database/models");

async function listar() {
    return Funcionario.findAll({
        order: [["nome", "ASC"]]
    });
}

async function buscarPorId(id) {
    return Funcionario.findByPk(id);
}

async function buscarPorNome(nome) {
    return Funcionario.findOne({
        where: { nome }
    });
}

async function criar(cliente) {
    return db.one(
        `INSERT INTO clientes (nome, email, telefone, endereco)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [cliente.nome, cliente.email, cliente.telefone, cliente.endereco]
    );
}

async function substituir(id, cliente) {
    return db.oneOrNone(`UPDATE clientes
        SET nome = $1, 
            email = $2,
            telefone = $3, 
            endereco = $4
        WHERE id = $5 
        RETURNING *`,
        [cliente.nome, cliente.email, cliente.telefone, cliente.endereco, id]
    );
}

async function excluir(id) {
    return db.oneOrNone("DELETE FROM clientes WHERE id = $1 RETURNING *",
        [id]);
}

module.exports = {
    listar,
    listarPorID,
    listarPorEmail,
    listarPorTelefone,
    criar,
    substituir,
    excluir
};



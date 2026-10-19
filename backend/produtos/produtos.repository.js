const db = require("../database/database");

async function listar() {
    return db.any("SELECT * FROM produtos ORDER BY nome");
}

async function listarPorID(id) {
    return db.oneOrNone("SELECT * FROM produtos WHERE id = $1", [id]);
}

async function listarPorNome(nome) {
    return db.oneOrNone("SELECT * FROM produtos WHERE nome = $1", [nome]);
}

async function criar(produto) {
    return db.one(
        `INSERT INTO produtos (nome, descricao, categoria, preco, unidade_medida,
        fator_conversao, situacao)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            produto.nome, produto.descricao, produto.categoria, produto.preco,
            produto.unidadeMedida, produto.fatorConversao, produto.situacao
        ]
    );
}

async function substituir(id, produto) {
    return db.oneOrNone(`UPDATE produtos
        SET nome = $1, 
            descricao = $2,
            categoria = $3, 
            preco = $4,
            unidade_medida = $5,
            fator_conversao = $6,
            situacao = $7
        WHERE id = $8 
        RETURNING *`,
        [
            produto.nome, produto.descricao, produto.categoria, produto.preco,
            produto.unidadeMedida, produto.fatorConversao, produto.situacao, id
        ]
    );
}

async function excluir(id) {
    return db.oneOrNone("DELETE FROM produtos WHERE id = $1 RETURNING *",
        [id]);
}

module.exports = {
    listar,
    listarPorID,
    listarPorNome,
    criar,
    substituir,
    excluir
};

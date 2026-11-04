const { Produto } = require("../database/models");

async function listar() {
    return Produto.findAll({ order: [["nome", "ASC"]] });
}

async function listarPorID(id) {
    const produto = await Produto.findByPk(id);
    if (!produto)
        return null

    return produto;
}

async function listarPorNome(nome) {
    const produto = await Produto.findOne({
        where: { nome: nome } 
    });
    if (!produto)
        return null;

    return produto;
}

async function criar(dados) {
    return Produto.create(dados);
}

async function substituir(id, dados) {
    const produto = await Produto.findByPk(id);
    if (!produto) 
        return null;
    
    return produto.update(dados);
}

async function excluir(id) {
    const produto = await Produto.findByPk(id);
    if (!produto)
        return null;

    await produto.destroy();
    return produto;
}

module.exports = {
    listar,
    listarPorID,
    listarPorNome,
    criar,
    substituir,
    excluir
};
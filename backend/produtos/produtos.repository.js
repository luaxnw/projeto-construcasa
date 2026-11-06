const { Produto } = require("../database/models");

async function listar() {
    return Produto.findAll({ order: [["nome", "ASC"]] });
}

async function buscarPorId(id) {
    const produto = await Produto.findByPk(id);
    if (!produto)
        return null

    return produto;
}

async function buscarPorNome(nome) {
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

    await produto.update(dados);

    return produto;
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
    buscarPorId,
    buscarPorNome,
    criar,
    substituir,
    excluir
};
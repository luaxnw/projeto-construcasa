const { Produto } = require("../database/models");

async function listar() {
    return Produto.findAll({ order: [["nome", "ASC"]] });
}

async function listarPorId(id) {
    const produto = Produto.findByPk(id);
    if (!produto)
        return null

    return produto;
}

async function buscarPorNome(nome) {
    const produto = Produto.findOne({ 
        where: { nome: nome } 
    });
    if (!produto)
        return null;

    return produto;
}

async function criar(dados) {
    return Produto.create(dados);
}

async function atualizar(id, dados) {
    const produto = await Produto.findByPk(id);
    if (!produto) 
        return null;
    
    return Produto.update(dados);
}

async function deletar(id) {
    const produto = await Produto.findByPk(id);
    if (!produto)
        return null;

    await Produto.destroy();
    return produto;
}

module.exports = {
    listar,
    listarPorId,
    buscarPorNome,
    criar,
    atualizar,
    deletar
};
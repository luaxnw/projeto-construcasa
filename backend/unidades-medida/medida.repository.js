const { UnidadeMedida } = require("../database/models");

async function listar() {
    return UnidadeMedida.findAll({ order: [["nome", "ASC"]] });
}

async function listarPorId(id) {
    return UnidadeMedida.findByPk(id);
}

async function buscarPorNome(nome) {
    return UnidadeMedida.findOne({ 
        where: { nome: nome } 
    });
}

async function criar(dados) {
    return UnidadeMedida.create(dados);
}

async function atualizar(id, dados) {
    const UnidadeMedida = await UnidadeMedida.findByPk(id);
    if (!UnidadeMedida) return null;
    return UnidadeMedida.update(dados);
}

async function deletar(id) {
    const UnidadeMedida = await UnidadeMedida.findByPk(id);
    if (!UnidadeMedida) return null;
    await UnidadeMedida.destroy();
    return UnidadeMedida;
}

module.exports = {
    listar,
    listarPorId,
    buscarPorNome,
    criar,
    atualizar,
    deletar
};
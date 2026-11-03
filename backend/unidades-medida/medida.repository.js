const { UnidadeMedida } = require("../database/models");

async function listar() {
    return UnidadeMedida.findAll({ order: [["nome", "ASC"]] });
}

async function listarPorId(id) {
    const unidadeMedida = UnidadeMedida.findByPk(id);
    if (!unidadeMedida)
        return null

    return unidadeMedida;
}

async function buscarPorNome(nome) {
    const unidadeMedida = UnidadeMedida.findOne({ 
        where: { nome: nome } 
    });
    if (!unidadeMedida)
        return null;

    return unidadeMedida;
}

async function criar(dados) {
    return UnidadeMedida.create(dados);
}

async function atualizar(id, dados) {
    const unidadeMedida = await UnidadeMedida.findByPk(id);
    if (!unidadeMedida) 
        return null;
    
    return UnidadeMedida.update(dados);
}

async function deletar(id) {
    const unidadeMedida = await UnidadeMedida.findByPk(id);
    if (!unidadeMedida)
        return null;

    await UnidadeMedida.destroy();
    return unidadeMedida;
}

module.exports = {
    listar,
    listarPorId,
    buscarPorNome,
    criar,
    atualizar,
    deletar
};
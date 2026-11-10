const { UnidadeMedida } = require("../database/models");

async function listar() {
    return UnidadeMedida.findAll({
        order: [["nome", "ASC"]]
    });
}

async function buscarPorId(id) {
    return UnidadeMedida.findByPk(id);
}

async function buscarPorNome(nome) {
    return UnidadeMedida.findOne({
        where: { nome }
    });
}

async function criar(dados) {
    return UnidadeMedida.create(dados);
}

async function substituir(id, dados) {
    const unidadeMedida = await UnidadeMedida.findByPk(id);

    if (!unidadeMedida)
        return null;

    await unidadeMedida.update(dados);

    return unidadeMedida;
}

async function excluir(id) {
    const unidadeMedida = await UnidadeMedida.findByPk(id);

    if (!unidadeMedida)
        return null;

    await unidadeMedida.destroy();

    return unidadeMedida;
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    substituir,
    excluir
};

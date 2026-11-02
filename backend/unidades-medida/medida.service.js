const repository = require('./medida.repository');

async function listar() {
    return repository.listar();
}

async function buscarPorId(id) {
    return repository.buscarPorId(id);
}

async function buscarPorNome(nome) {
    return repository.buscarPorNome(nome);
}

async function criar(unidadeMedida) {
    if (await buscarPorNome(unidadeMedida.nome))
        throw new Error("MEDIDA_JA_EXISTE");

    return repository.criar(unidadeMedida);
}

async function atualizar(id, unidadeMedida) {
    if (!await buscarPorId(id))
        throw new Error("MEDIDA_NAO_EXISTE");

    const unidadeMedidaNome = await buscarPorNome(unidadeMedida.nome);

    if (unidadeMedida && unidadeMedida.id !== id)
        throw new Error("MEDIDA_JA_EXISTE");

    return repository.atualizar(id, unidadeMedida);
}

async function deletar(id) {
    if (!await buscarPorId(id))
        throw new Error("MEDIDA_NAO_EXISTE");

    return repository.deletar(id);
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    atualizar,
    deletar
};
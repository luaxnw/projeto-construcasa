const repository = require('./medida.repository');

async function listar() {
    return repository.listar();
}

async function buscarPorId(id) {
    const medida = await repository.buscarPorId(id);
    if (!medida)
        throw new Error("MEDIDA_NAO_EXISTE");
    
    return medida;
}

async function buscarPorNome(nome) {
    const medida = await repository.buscarPorNome(nome);
    if (!medida)
        throw new Error("MEDIDA_NAO_EXISTE");

    return medida;
}

async function criar(unidadeMedida) {
    if (await buscarPorNome(unidadeMedida.nome))
        throw new Error("MEDIDA_JA_EXISTE");

    return repository.criar(unidadeMedida);
}

async function atualizar(id, unidadeMedida) {
    const medida = await repository.atualizar(id, unidadeMedida);
    if (!medida)
        throw new Error("MEDIDA_NAO_EXISTE");

    const unidadeMedidaNome = await buscarPorNome(unidadeMedida.nome);

    if (unidadeMedidaNome && unidadeMedidaNome.id !== id)
        throw new Error("MEDIDA_JA_EXISTE");

    return medida;
}

async function deletar(id) {
    const emprestimoDeletado = await repository.deletar(id);
    if (!emprestimoDeletado)
        throw new Error("MEDIDA_NAO_EXISTE");

    return emprestimoDeletado;
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    atualizar,
    deletar
};
const repository = require("./medida.repository");

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
    const medidaExistente = await repository.buscarPorNome(unidadeMedida.nome);

    if (medidaExistente)
        throw new Error("MEDIDA_JA_EXISTE");

    return repository.criar(unidadeMedida);
}

async function substituir(id, unidadeMedida) {
    const medidaExistente = await repository.buscarPorNome(unidadeMedida.nome);

    if (medidaExistente && medidaExistente.id !== Number(id))
        throw new Error("MEDIDA_JA_EXISTE");

    const medidaAtualizada = await repository.substituir(id, unidadeMedida);

    if (!medidaAtualizada)
        throw new Error("MEDIDA_NAO_EXISTE");

    return medidaAtualizada;
}

async function excluir(id) {
    const medidaDeletada = await repository.excluir(id);

    if (!medidaDeletada)
        throw new Error("MEDIDA_NAO_EXISTE");

    return medidaDeletada;
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    substituir,
    excluir
};
const repository = require("./categorias.repository");

async function listar() {
    return repository.listar();
}

async function listarPorID(id) {
    return repository.buscarPorId(id);
}

async function criar(categoria) {
    if (await repository.buscarPorNome(categoria.nome)) {
        throw new Error("NOME_JA_EXISTE");
    }

    return repository.criar(categoria);
}

async function substituir(id, categoria) {
    if (!await listarPorID(id)) {
        throw new Error("CATEGORIA_NAO_EXISTE");
    }

    const existente = await repository.buscarPorNome(categoria.nome);
    if (existente && existente.id_categoria !== id) {
        throw new Error("NOME_JA_EXISTE");
    }

    await repository.substituir(id, categoria);
    return listarPorID(id);
}

async function excluir(id) {
    if (!await listarPorID(id)) {
        throw new Error("CATEGORIA_NAO_EXISTE");
    }

    return repository.excluir(id);
}

module.exports = {
    listar,
    listarPorID,
    criar,
    substituir,
    excluir
};
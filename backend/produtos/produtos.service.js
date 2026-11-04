const repository = require("./produtos.repository");

async function listar() {
    return repository.listar();
}

async function listarPorID(id) {
    return repository.listarPorID(id);
}

async function listarPorNome(nome) {
    return repository.listarPorNome(nome);
}

async function criar(produto) {
    if (await listarPorNome(produto.nome))
        throw new Error("PRODUTO_JA_EXISTE");

    return repository.criar(produto);
}

async function substituir(id, produto) {
    if (!await listarPorID(id))
        throw new Error("PRODUTO_NAO_EXISTE");

    const produtoNome = await listarPorNome(produto.nome);

    if (produtoNome && produtoNome.id !== id) {
        throw new Error("NOME_JA_EXISTE");
    }

    return repository.substituir(id, produto);
}

async function excluir(id) {
    if (!await listarPorID(id)) {
        throw new Error("PRODUTO_NAO_EXISTE");
    }

    return repository.excluir(id);
}

module.exports = {
    listar,
    listarPorID,
    listarPorNome,
    criar,
    substituir,
    excluir
};
const repository = require("./produtos.repository");

async function listar() {
    return repository.listar();
}

async function buscarPorId(id) {
    const produto = await repository.buscarPorId(id);

    if (!produto)
        throw new Error("PRODUTO_NAO_EXISTE");

    return produto;
}

async function buscarPorNome(nome) {
    const produto = await repository.buscarPorNome(nome);

    if (!produto)
        throw new Error("PRODUTO_NAO_EXISTE");

    return produto;
}

async function criar(produto) {
    if (await buscarPorNome(produto.nome))
        throw new Error("PRODUTO_JA_EXISTE");

    return repository.criar(produto);
}

async function substituir(id, produto) {
    const produtoRet = await repository.substituir(id, produto);

    if (!produtoRet)
        throw new Error("PRODUTO_NAO_EXISTE");

    const produtoNome = await buscarPorNome(produto.nome);

    if (produtoNome && produtoNome.id_produto !== id)
        throw new Error("NOME_JA_EXISTE");

    return produtoRet;
}

async function excluir(id) {
    if (!await buscarPorId(id))
        throw new Error("PRODUTO_NAO_EXISTE");

    return repository.excluir(id);
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    substituir,
    excluir
};
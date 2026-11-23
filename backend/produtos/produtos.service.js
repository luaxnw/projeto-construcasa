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
    if (await repository.buscarPorNome(produto.nome))
        throw new Error("PRODUTO_JA_EXISTE");

    const criado = await repository.criar(produto);
    return repository.buscarPorId(criado.id_produto);
}

async function substituir(id, produto) {
    await buscarPorId(id);

    const existente = await repository.buscarPorNome(produto.nome);
    if (existente && existente.id_produto !== id)
        throw new Error("NOME_JA_EXISTE");

    await repository.substituir(id, produto);
    return repository.buscarPorId(id);
}

async function excluir(id) {
    await buscarPorId(id);
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
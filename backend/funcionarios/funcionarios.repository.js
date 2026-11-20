const { Funcionario } = require("../database/models");

async function listar() {
    return Funcionario.findAll({
        order: [["nome", "ASC"]]
    });
}

async function buscarPorId(id) {
    return Funcionario.findByPk(id);
}

async function buscarPorNome(nome) {
    return Funcionario.findOne({
        where: { nome }
    });
}

async function criar(dados) {
    return Funcionario.create(dados);
}

async function substituir(id, dados) {
    const funcionario = await Funcionario.findByPk(id);

    if (!funcionario)
        return null;

    await funcionario.update(dados);

    return funcionario;
}

async function excluir(id) {
    const funcionario = await Funcionario.findByPk(id);

    if (!funcionario)
        return null;

    await funcionario.destroy();

    return funcionario;
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    substituir,
    excluir
};



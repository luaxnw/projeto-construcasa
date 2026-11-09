const { Cliente } = require("../database/models");

async function listar() {
    return Cliente.findAll({
        order: [["nome", "ASC"]]
    });
}

async function buscarPorId(id) {
    return Cliente.findByPk(id);
}

async function buscarPorEmail(email) {
    return Cliente.findOne({
        where: { email }
    });
}

async function buscarPorTelefone(telefone) {
    return Cliente.findOne({
        where: { telefone }
    });
}

async function buscarPorCpf(cpf) {
    return Cliente.findOne({
        where: { cpf }
    });
}

async function criar(dados) {
    return Cliente.create(dados);
}

async function substituir(id, dados) {
    return Cliente.update(dados, {
        where: { id_cliente: id }
    });
}

async function excluir(id) {
    return Cliente.destroy({
        where: { id_cliente: id }
    });
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorCpf,
    buscarPorEmail,
    buscarPorTelefone,
    criar,
    substituir,
    excluir
};
const sequelize = require("../database/connection");
const { Cliente, Endereco } = require("../database/models");

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

async function buscarPorCpfCnpj(cpf_cnpj) {
    return Cliente.findOne({
        where: { cpf_cnpj }
    });
}

async function criar({ endereco, ...dados }) {
    return sequelize.transaction(async (t) => {
        let id_endereco = null;

        if (endereco) {
            const novoEndereco = await Endereco.create(endereco, { transaction: t });
            id_endereco = novoEndereco.id_endereco;
        }

        return Cliente.create({ ...dados, id_endereco }, { transaction: t });
    });
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
    buscarPorEmail,
    buscarPorTelefone,
    buscarPorCpfCnpj,
    criar,
    substituir,
    excluir
};
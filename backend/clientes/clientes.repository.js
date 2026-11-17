const sequelize = require("../database/connection");
const { Cliente, Endereco } = require("../database/models");

async function listar() {
    return Cliente.findAll({
        order: [["nome", "ASC"]]
    });
}

async function buscarPorId(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return null;

    const endereco = cliente.id_endereco
        ? await Endereco.findByPk(cliente.id_endereco)
        : null;

    return {
        ...cliente.toJSON(),
        endereco: endereco ? endereco.toJSON() : null
    };
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

async function substituir(id, { endereco, ...dados }) {
    return sequelize.transaction(async (t) => {
        const cliente = await Cliente.findByPk(id, { transaction: t });
        let id_endereco = null;

        if (endereco && cliente.id_endereco) {
            await Endereco.update(endereco, {
                where: { id_endereco: cliente.id_endereco },
                transaction: t
            });
            id_endereco = cliente.id_endereco;
        } else if (endereco) {
            const novo = await Endereco.create(endereco, { transaction: t });
            id_endereco = novo.id_endereco;
        }

        return Cliente.update(
            { ...dados, id_endereco },
            { where: { id_cliente: id }, transaction: t }
        );
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
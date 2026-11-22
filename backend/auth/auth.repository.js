const { Funcionario } = require("../database/models");

async function buscarPorCpf(cpf) {
    return Funcionario.findOne({
        where: { cpf }
    });
}

async function buscarPorId(id) {
    return Funcionario.findByPk(id);
}

module.exports = {
    buscarPorCpf,
    buscarPorId
};
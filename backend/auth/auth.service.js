const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const repository = require("../funcionarios/funcionarios.repository");

async function autenticarUsuario(cpf, senha) {

    cpf = cpf.replace(/\D/g, "");

    const funcionario = await repository.buscarPorCpf(cpf);

    if (!funcionario || !funcionario.ativo || !funcionario.senha_hash) {
        throw new Error("ERRO_CREDENCIAL");
    }

    const senhaValida = await bcrypt.compare(
        senha,
        funcionario.senha_hash
    );

    if (senhaValida) {
        return {
            sucesso: true,
            usuario: funcionario
        };
    } else {
        throw new Error("ERRO_CREDENCIAL");
    }
}

function gerarToken(funcionario) {

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET_NAO_CONFIGURADO");
    }

    return jwt.sign(
        {
            id_funcionario: funcionario.id_funcionario
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h"
        }
    );
}

module.exports = {
    autenticarUsuario,
    gerarToken
};
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const repository = require("../funcionarios/funcionarios.repository")

async function autenticarUsuario(cpf, senha) {

    cpf = cpf.replace(/[.\-/]/g, "");

    const funcionario = await repository.buscarPorCpf(cpf);

    if (!funcionario)
        throw new Error("ERRO_CREDENCIAL");

    const senhaValida = await bcrypt.compare(senha, funcionario.senha);

    if (senhaValida) {
        return { sucesso: true, usuario: funcionario };
    } else {
        throw new Error("ERRO_CREDENCIAL");
    }
}

function gerarToken(username) {
    return jwt.sign(
        { username: username },
        "your-secret-key",
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
}

module.exports = {
    autenticarUsuario,
    gerarToken
}

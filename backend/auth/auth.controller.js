const service = require("./auth.service");

async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !password
        ) {
            return res.status(400).json({
                erro: "CPF e senha são obrigatórios"
            });
        }

        const usernameNormalizado = username.replace(/\D/g, "");

        const resultado = await service.autenticarUsuario(
            usernameNormalizado,
            password
        );

        // Passa o funcionário autenticado, não o CPF
        const token = service.gerarToken(resultado.usuario);

        return res.status(200).json({
            message: "Login successful",
            token: token,
            usuario: {
                id: resultado.usuario.id_funcionario,
                nome: resultado.usuario.nome,
                role: resultado.usuario.role?.nome
            }
        });

    } catch (erro) {
        if (erro.message === "ERRO_CREDENCIAL") {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Credenciais inválidas."
            });
        }

        console.log("Erro ao fazer login:", erro);

        return res.status(500).json({
            erro: erro.message
        });
    }
}

async function logout(req, res) {
    return res.status(200).json({
        message: "Logout successful. Remova o token armazenado no cliente."
    });
}

module.exports = {
    login,
    logout
};
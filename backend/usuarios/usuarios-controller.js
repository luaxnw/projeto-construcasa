const services = require('usuarios-services');

function listarUsuarios(req, res) {
    const usuarios = services.listarUsuarios();

    return res.status(200).json(usuarios);
}

function listarUsuarioPorID(req, res) {
    const id = parseInt(req.params.id);
    const usuario = services.procurarUsuarioPorID(id);

    if (!usuario)
        return res.status(404).json({ erro: `Usuário de ${id} não econtrado` });

    return res.status(200).json(usuario);
}

function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Informe dados válidos",
                detalhes: [
                    !nome && { campo: "nome", mensagem: "Obrigatóro" },
                    !email && { campo: "email", mensagem: "Obrigatório" },
                    !senha && { campo: "senha", mensagem: "Obrigatório" },
                ].filter(Boolean)
            });
        };

        usuarioNovo = services.cadastrarUsuario(nome, email, senha);
        return res.status(201).json(usuarioNovo);

    } catch (erro) {
        res.status(400).json({ status: erro.message });
    }
}
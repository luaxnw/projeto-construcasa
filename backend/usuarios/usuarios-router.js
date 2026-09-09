const express = require('express');
const router = express.Router();

const database = require('../database');

// ROTAS    
router.get('/', (req, res) => {
    res.status(200).json({ usuarios: "usuario" });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            erro: "Informe dados válidos"
        });
    };

    const usuario = database.usuarios.find(u => u.id === id);
    if (!usuario)
        return res.status(404).json({erro: `Usuário de id ${id} não encontrado`});

    return res.status(200).json(usuario);
});

router.post('/', (req, res) => {
    const { nome, email, senha } = req.body;

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

    const usuarioNovo = {
        id: proximoId++,
        nome: nome,
        email: email,
        senha: senha
    };

    database.usuarios.push(usuarioNovo);

    return res.status(201).set('Location', '/api/usuarios/' + usuarioNovo.id)
    .json(usuarioNovo);

});




module.exports = router;
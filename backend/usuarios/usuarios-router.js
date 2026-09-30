const express = require('express');
const router = express.Router();

const db = require('../database');

// ROTAS    
router.get('/', (req, res) => {
    res.status(200).json(db.usuarios);
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            erro: "Informe dados válidos"
        });
    };

    const indexUsuario = db.usuarios.findIndex((u) => u.id === id);
    if (indexUsuario === -1)
        return res.status(404).json({ erro: `Usuário de ${id} não econtrado` });

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
        id: db.proximoIdUsuario++,
        nome: nome,
        email: email,
        senha: senha
    };

    db.usuarios.push(usuarioNovo);

    return res.status(201).set('Location', '/api/usuarios/' + usuarioNovo.id)
        .json(usuarioNovo);
});

router.put('/', (req, res) => {
    const id = parseInt(req.params.id);
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

    const indexUsuario = db.usuarios.findIndex((u) => u.id === id);
    if (indexUsuario === -1)
        return res.status(404).json({ erro: `Usuário de ${id} não econtrado` });

    db.usuarios[indexUsuario] = { id, nome, email, senha };

    return res.status(201).set('Location', '/api/usuarios/' + id)
        .json(db.usuarios[indexUsuario]);
});


module.exports = router;
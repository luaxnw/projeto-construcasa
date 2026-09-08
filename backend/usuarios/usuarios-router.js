const express = require('express');
const router = express.Router();



// ROTAS    
router.get('/', (req, res) => {
    res.status(200).json({ usuarios: "usuario" });
});

router.post('/cadastrar', (req, res) => {
    const { nome, email } = req.body;
    let { id } = req.body;

    if (id === undefined || !nome || !email) {
        return res.status(400).json({
            erro: "Informe dados válidos"
        });
    };

    id = parseInt(id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            erro: "Informe dados válidos"
        });
    };

    const usuarioNovo = {
        id: id,
        nome: nome,
        email: email
    };

    return res.status(201).json({sucesso: "sucesso"});

});




module.exports = router;
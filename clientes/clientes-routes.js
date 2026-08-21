const fs = require('fs');

const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
    res.status(200).json({ clientes: ["empresa1", "empresa2", "empresa3"] });
});

router.post("/", (req, res) => {
    const { nome, email, responsavel_pelo_contato } = req.body;
    let { id } = req.body;

    id = parseInt(id);

    if (id == undefined || !nome || !email || !responsavel_pelo_contato)
        return res.status(400).json({ status: "informe dados válidos" });

    return res.status(200).json({
        "id": id,
        "nome": nome,
        "responsavel_pelo_contato": responsavel_pelo_contato,
        "email": email
    });

    const auxParaSalvar = {
        "id": id,
        "nome": nome,
        "responsavel_pelo_contato": responsavel_pelo_contato,
        "email": email
    }

    

});

module.exports = router;
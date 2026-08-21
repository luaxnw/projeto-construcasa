const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ clientes: ["empresa1", "empresa2", "empresa3"] });
});

router.post("/", (req, res) => {
    const { nome, email } = req.body;
    let { id } = req.body;

    id = parseInt(id);

    if (id == undefined || !nome || !email)
        return res.status(400).json({status: "informe dados válidos"});

    return res.status(200).json({
        "id": id,
        "nome": nome,
        "email": email
    })
});

module.exports = router;
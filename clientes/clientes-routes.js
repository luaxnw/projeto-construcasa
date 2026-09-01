const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).sendFile("../public/index.html")
});

router.post("/", (req, res) => {
    const { nome, contato } = req.body;
    let { id, valorContrato } = req.body;

    id = parseInt(id);
    valorContrato = parseFloat(valorContrato);

    if (id == undefined || valorContrato == undefined || !nome || !contato)
        return res.status(400).json({ status: "informe dados válidos" });

    return res.status(200).json({
        "id": id,
        "nome": nome,
        "contato": contato,
        "valor_contrato": valorContrato
    });
});

module.exports = router;
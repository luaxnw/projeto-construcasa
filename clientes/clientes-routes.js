clientes = [];

const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).sendFile("../public/index.html")
});

router.post("/", (req, res) => {

    const { nome, contato } = req.body;
    let { valorContrato } = req.body;

    valorContrato = parseFloat(valorContrato);

    if (Number.isNaN(valorContrato) || !nome || !contato)
        return res.status(400).json({ status: "informe dados válidos" });


    const cliente = {
        id: clientes.length + 1,
        nome: nome,
        contato: contato,
        valor_contrato: valorContrato
    };

    clientes.push(cliente);

    return res.status(201).json(cliente);
});

module.exports = router;
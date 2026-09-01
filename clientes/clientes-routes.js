const fs = require('fs');

const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
    res.status(200).sendFile("../public/index.html")
});

router.post("/", (req, res) => {
<<<<<<< HEAD
    const { nome, contato } = req.body;
    let { id, valorContrato } = req.body;
=======
    const { nome, email, responsavel_pelo_contato } = req.body;
    let { id } = req.body;
>>>>>>> 53d171b66eece9c675a281e59426c1959d742ba9

    id = parseInt(id);
    valorContrato = parseFloat(valorContrato);

<<<<<<< HEAD
    if (id == undefined || valorContrato == undefined || !nome || !contato)
=======
    if (id == undefined || !nome || !email || !responsavel_pelo_contato)
>>>>>>> 53d171b66eece9c675a281e59426c1959d742ba9
        return res.status(400).json({ status: "informe dados válidos" });

    return res.status(200).json({
        "id": id,
        "nome": nome,
<<<<<<< HEAD
        "contato": contato,
        "valor_contrato": valorContrato
    });
=======
        "responsavel_pelo_contato": responsavel_pelo_contato,
        "email": email
    });

    const auxParaSalvar = {
        "id": id,
        "nome": nome,
        "responsavel_pelo_contato": responsavel_pelo_contato,
        "email": email
    }

    

>>>>>>> 53d171b66eece9c675a281e59426c1959d742ba9
});

module.exports = router;
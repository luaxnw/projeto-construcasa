const express = require('express');
const controller = require('./clientes-controller');

const router = express.Router();

// ROTAS    

router.get("/clientes", controller.listar);
router.get("/clientes/:id", controller.listarPorID)

router.post("/clientes", controller.criar);

module.exports = router;
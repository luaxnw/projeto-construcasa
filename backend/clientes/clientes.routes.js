const express = require('express');
const controller = require('./clientes.controller');

const router = express.Router();

// ROTAS    

router.get("/clientes", controller.listar);
router.get("/clientes/:id", controller.buscarPorId)

router.post("/clientes", controller.criar);

router.put("/clientes/:id", controller.substituir);

router.delete("/clientes/:id", controller.excluir);

module.exports = router;
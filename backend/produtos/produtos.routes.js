const express = require('express');
const controller = require('./produtos.controller');

const router = express.Router();

// ROTAS    

router.get("/produtos", controller.listar);
router.get("/produtos/:id", controller.listarPorID)

router.post("/produtos", controller.criar);

router.put("/produtos/:id", controller.substituir);

router.delete("/produtos/:id", controller.excluir);

module.exports = router;
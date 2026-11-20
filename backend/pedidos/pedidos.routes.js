const express = require("express");
const controller = require("./pedidos.controller");

const router = express.Router();

router.get("/pedidos", controller.listar);
router.get("/pedidos/:id", controller.buscarPorId);
router.post("/pedidos", controller.criar);

module.exports = router;
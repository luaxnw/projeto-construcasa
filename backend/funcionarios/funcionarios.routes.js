const express = require("express");
const controller = require("./funcionarios.controller");

const router = express.Router();

router.get("/funcionarios", controller.listar);

router.get("/funcionarios/:id", controller.buscarPorId);

router.post("/funcionarios", controller.criar);

router.put("/funcionarios/:id", controller.substituir);

router.delete("/funcionarios/:id", controller.excluir);

module.exports = router;
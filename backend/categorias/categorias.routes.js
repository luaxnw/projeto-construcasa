const express = require("express");
const controller = require("./categorias.controller");

const router = express.Router();

router.get("/categorias", controller.listar);
router.get("/categorias/:id", controller.listarPorID);
router.post("/categorias", controller.criar);
router.put("/categorias/:id", controller.substituir);
router.delete("/categorias/:id", controller.excluir);

module.exports = router;
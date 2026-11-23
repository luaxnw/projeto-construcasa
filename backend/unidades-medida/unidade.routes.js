const express = require("express");
const controller = require("./medida.controller");

const router = express.Router();

router.get("/unidades", controller.listar);

router.get("/unidades/:id", controller.buscarPorId);

router.post("/unidades", controller.criar);

router.put("/unidades/:id", controller.atualizar);

router.delete("/unidades/:id", controller.deletar);

module.exports = router;
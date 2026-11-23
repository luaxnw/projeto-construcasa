const express = require("express");
const controller = require("./funcionarios.controller");

const { requireJWTAuth } = require("../auth/auth.config");
const { requirePermissao } = require("../auth/auth.config");

const router = express.Router();

router.get("/funcionarios", requireJWTAuth, requirePermissao("ADMIN"), controller.listar);

router.get("/funcionarios/:id", requireJWTAuth, requirePermissao("ADMIN"), controller.buscarPorId);

router.post("/funcionarios", requireJWTAuth, requirePermissao("ADMIN"), controller.criar);

router.put("/funcionarios/:id", requireJWTAuth, requirePermissao("ADMIN"), controller.substituir);

router.delete("/funcionarios/:id", requireJWTAuth, requirePermissao("ADMIN"), controller.excluir);

module.exports = router;
const express = require("express");
const controller = require("./dashboard.controller");

const { requireJWTAuth } = require("../auth/auth.config");
const { requirePermissao } = require("../auth/auth.config");

const router = express.Router();

router.get("/dashboard", controller.resumo);

module.exports = router;
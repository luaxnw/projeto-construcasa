const express = require("express");
const controller = require("./dashboard.controller");

const router = express.Router();

router.get("/dashboard", controller.resumo);

module.exports = router;
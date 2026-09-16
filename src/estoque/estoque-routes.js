const express = require('express');
const router = express.Router();

const db = require('../database');

// ROTAS

router.get('/', (req, res) => {
    res.status(200).json(db.estoque);
});




module.exports = router;
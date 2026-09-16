const express = require('express');
const router = express.Router();

const db = require('../database');

// ROTAS

router.get('/', (req, res) => {
    res.status(200).json(db.produtos);
});

router.get('/:id', (req, res) => {

});

module.exports = router;


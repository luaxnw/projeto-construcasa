const express = require('express');
const app = express();
const PORTA = 3001;


// ROTAS
const usuariosRouter = require("./usuarios/usuarios-router");


app.use(express.json());

app.listen(PORTA, () => {
    console.log(`servidor rodando na porta ${PORTA}`);
});

app.use('/api/usuarios', usuariosRouter);
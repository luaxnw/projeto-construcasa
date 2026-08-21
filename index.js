const express = require('express');

const app = express();
app.use(express.json());

const PORTA = 3001;

const clientesRouter = require("./clientes/clientes-routes");

app.listen(PORTA, () => {
    console.log(`servidor rodando na porta ${PORTA}`);
});

app.use('/api/clientes', clientesRouter);
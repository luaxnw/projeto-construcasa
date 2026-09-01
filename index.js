const express = require('express');
const app = express();
const clientesRouter = require("./clientes/clientes-routes");
const PORTA = 3001;

app.use(express.json());
app.use(express.static("public"))

app.listen(PORTA, () => {
    console.log(`servidor rodando na porta ${PORTA}`);
});

app.use('/api/clientes', clientesRouter);
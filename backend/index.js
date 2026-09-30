const express = require('express');
const app = express();
const PORTA = 3001;


// ROTAS
const usuariosRouter = require('./usuarios/usuarios-router');
const categoriasRouter = require('./categorias/categorias-routes');
const estoqueRouter = require('./estoque/estoque-routes');
const produtosRouter = require('./produtos/produtos-routes');
const pedidosRouter = require('./pedidos/pedidos-routes');


app.use(express.json());

app.listen(PORTA, () => {
    console.log(`servidor rodando na porta ${PORTA}`);
});

app.use('/api/usuarios', usuariosRouter);
//app.use('/api/categorias', categoriasRouter);
//app.use('/api/estoque', estoqueRouter);
//app.use('/api/produtos', produtosRouter);
//app.use('/api/estoque', estoqueRouter);
//app.use('/api/pedidos', pedidosRouter);
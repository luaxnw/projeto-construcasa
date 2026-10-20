const express = require('express');
const app = express();
const PORTA = 3001;

app.use(express.json());

// ROTAS
const clientesRoutes = require('./clientes/clientes.routes');
//const categoriasRouter = require('./categorias/categorias-routes'); 
//const estoqueRouter = require('./estoque/estoque-routes');
const produtosRouter = require('./produtos/produtos.routes');
//const pedidosRouter = require('./pedidos/pedidos-routes');

app.use(clientesRoutes);
app.use(produtosRouter);

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

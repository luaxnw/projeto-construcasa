const express = require('express');
const app = express();
const PORTA = 3001;
const cors = require('cors');

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// ROTAS
const clientesRoutes = require('./clientes/clientes.routes');
//const categoriasRouter = require('./categorias/categorias-routes'); 
//const estoqueRouter = require('./estoque/estoque-routes');
const produtosRouter = require('./produtos/produtos.routes');
//const pedidosRouter = require('./pedidos/pedidos-routes');
const medidasRouter = require('./unidades-medida/unidade.routes');
//const funcionariosRoutes = require('./funcionarios/funcionarios-routes');

app.use(clientesRoutes);
app.use(produtosRouter);
app.use(medidasRouter);
//app.use(funcionariosRoutes);

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

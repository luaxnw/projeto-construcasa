// Carrega as variáveis do .env antes dos outros módulos
require('dotenv').config();

const express = require('express');
const app = express();
const PORTA = 3001;
const cors = require('cors');
const passport = require('passport');
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, '.env')
});

const {
    configureJwtStrategy
} = require('./auth/auth.config');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(passport.initialize());

configureJwtStrategy();


// ROTAS
const authRoutes = require('./auth/auth.routes');
const clientesRoutes = require('./clientes/clientes.routes');
const categoriasRouter = require('./categorias/categorias.routes');
const produtosRouter = require('./produtos/produtos.routes');
const pedidosRouter = require('./pedidos/pedidos.routes');
const medidasRouter = require('./unidades-medida/unidade.routes');
const funcionariosRoutes = require('./funcionarios/funcionarios.routes');
const dashboardRouter = require('./dashboard/dashboard.routes');

app.use(authRoutes);
app.use(clientesRoutes);
app.use(produtosRouter);
app.use(medidasRouter);
app.use(categoriasRouter);
app.use(pedidosRouter);
app.use(funcionariosRoutes);
app.use(dashboardRouter);


app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
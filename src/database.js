const fs = require('fs');

const database = {
    proximoIdUsuario: 1,
    usuarios: [],

    proximoIdProduto: 1,
    produtos: [],

    proximoIdCategoria: 1,
    categorias: [],

    estoque: [],
    
    proximoIdPedido: 1,
    pedidos: []
}

module.exports = database;
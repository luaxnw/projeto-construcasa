const { Cliente, Funcionario, Categoria, Produto, Pedido } = require("../database/models");

function contarClientes(where = {}) {
    return Cliente.count({ where });
}

function contarFuncionarios(where = {}) {
    return Funcionario.count({ where });
}

function contarCategorias(where = {}) {
    return Categoria.count({ where });
}

function contarProdutos(where = {}) {
    return Produto.count({ where });
}

function contarPedidos(where = {}) {
    return Pedido.count({ where });
}

function somarVendas(where = {}) {
    return Pedido.sum("valor_total", { where });
}

module.exports = {
    contarClientes,
    contarFuncionarios,
    contarCategorias,
    contarProdutos,
    contarPedidos,
    somarVendas,
};
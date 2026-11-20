const {
    Pedido,
    ItemPedido,
    Produto,
    Cliente,
    Funcionario,
    UnidadeMedida,
    sequelize,
} = require("../database/models");

// Só os campos que a tela precisa. O Funcionario NÃO traz senha_hash.
const INCLUIR = [
    { model: Cliente, as: "clientes", attributes: ["id_cliente", "nome", "telefone"] },
    { model: Funcionario, as: "funcionarios", attributes: ["id_funcionario", "nome"] },
    {
        model: ItemPedido,
        as: "itens",
        include: [
            { model: Produto, as: "produtos", attributes: ["id_produto", "nome"] },
            { model: UnidadeMedida, as: "unidades_medida", attributes: ["id_unidade_medida", "nome", "sigla"] },
        ],
    },
];

// Executa tudo dentro de uma transação: se qualquer passo falhar, nada é gravado
async function transacao(callback) {
    return sequelize.transaction(callback);
}

async function listar() {
    return Pedido.findAll({ include: INCLUIR, order: [["createdAt", "DESC"]] });
}

async function buscarPorId(id) {
    return Pedido.findByPk(id, { include: INCLUIR });
}

async function buscarClientePorId(id, t) {
    return Cliente.findByPk(id, { transaction: t });
}

async function buscarFuncionarioPorId(id, t) {
    return Funcionario.findByPk(id, { transaction: t });
}

// Trava as linhas dos produtos até o fim da transação, pra dois pedidos
// ao mesmo tempo não venderem o mesmo estoque duas vezes
async function buscarProdutosParaPedido(ids, t) {
    return Produto.findAll({
        where: { id_produto: ids },
        order: [["id_produto", "ASC"]],
        transaction: t,
        lock: t.LOCK.UPDATE,
    });
}

async function criarPedido(dados, t) {
    return Pedido.create(dados, { transaction: t });
}

async function criarItem(dados, t) {
    return ItemPedido.create(dados, { transaction: t });
}

async function baixarEstoque(produto, quantidade, t) {
    return produto.update(
        { qtd_estoque: produto.qtd_estoque - quantidade },
        { transaction: t }
    );
}

module.exports = {
    transacao,
    listar,
    buscarPorId,
    buscarClientePorId,
    buscarFuncionarioPorId,
    buscarProdutosParaPedido,
    criarPedido,
    criarItem,
    baixarEstoque,
};
const { Op } = require("sequelize");
const repository = require("./dashboard.repository");

// Precisa ser o mesmo valor do ESTOQUE_BAIXO em Produtos.jsx
const LIMITE_ESTOQUE_BAIXO = 20;

function inicioDoMes() {
    const agora = new Date();
    return new Date(agora.getFullYear(), agora.getMonth(), 1);
}

async function resumo() {
    const noMes = { [Op.gte]: inicioDoMes() };
    const naoCancelado = { [Op.ne]: "cancelado" };

    const [
        clientesTotal,
        clientesNoMes,
        funcionariosAtivos,
        categoriasTotal,
        categoriasAtivas,
        produtosTotal,
        produtosDisponiveis,
        produtosIndisponiveis,
        produtosEstoqueBaixo,
        pedidosTotal,
        pedidosEmAberto,
        pedidosAguardandoPagamento,
        pedidosFinalizados,
        pedidosCancelados,
        pedidosNoMes,
        vendasNoMes,
    ] = await Promise.all([
        repository.contarClientes(),
        repository.contarClientes({ created_at: noMes }),
        repository.contarFuncionarios({ ativo: true }),
        repository.contarCategorias(),
        repository.contarCategorias({ ativa: true }),
        repository.contarProdutos(),
        repository.contarProdutos({ ativo: true, qtd_estoque: { [Op.gt]: 0 } }),
        repository.contarProdutos({ [Op.or]: [{ ativo: false }, { qtd_estoque: 0 }] }),
        repository.contarProdutos({ ativo: true, qtd_estoque: { [Op.gt]: 0, [Op.lte]: LIMITE_ESTOQUE_BAIXO } }),
        repository.contarPedidos(),
        repository.contarPedidos({ status_pedido: "em_aberto" }),
        repository.contarPedidos({ status_pagamento: "aguardando_pagamento", status_pedido: naoCancelado }),
        repository.contarPedidos({ status_pedido: "finalizado" }),
        repository.contarPedidos({ status_pedido: "cancelado" }),
        repository.contarPedidos({ createdAt: noMes, status_pedido: naoCancelado }),
        repository.somarVendas({ status_pagamento: "pago", status_pedido: naoCancelado, createdAt: noMes }),
    ]);

    return {
        clientes: { total: clientesTotal, novosNoMes: clientesNoMes },
        funcionarios: { ativos: funcionariosAtivos },
        categorias: { total: categoriasTotal, ativas: categoriasAtivas },
        produtos: {
            total: produtosTotal,
            disponiveis: produtosDisponiveis,
            indisponiveis: produtosIndisponiveis,
            estoqueBaixo: produtosEstoqueBaixo,
        },
        pedidos: {
            total: pedidosTotal,
            emAberto: pedidosEmAberto,
            aguardandoPagamento: pedidosAguardandoPagamento,
            finalizados: pedidosFinalizados,
            cancelados: pedidosCancelados,
            noMes: pedidosNoMes,
        },
        vendas: { totalNoMes: Number(vendasNoMes) || 0 },
        atualizadoEm: new Date().toISOString(),
    };
}

module.exports = { resumo };
const repository = require("./pedidos.repository");

// Erro de regra de negócio. "detalhes" leva dados pro controller montar a mensagem
function erroNegocio(codigo, detalhes) {
    const erro = new Error(codigo);
    if (detalhes) erro.detalhes = detalhes;
    return erro;
}

function arredondar(valor) {
    return Math.round(valor * 100) / 100;
}

// Se o mesmo produto vier duas vezes, soma as quantidades
function consolidarQuantidades(itens) {
    const quantidades = new Map();
    for (const item of itens) {
        const id = Number(item.id_produto);
        quantidades.set(id, (quantidades.get(id) || 0) + Number(item.quantidade));
    }
    return quantidades;
}

async function listar() {
    return repository.listar();
}

async function buscarPorId(id) {
    const pedido = await repository.buscarPorId(id);

    if (!pedido)
        throw erroNegocio("PEDIDO_NAO_EXISTE");

    return pedido;
}

async function criar(dados) {
    const quantidades = consolidarQuantidades(dados.itens);

    const idPedido = await repository.transacao(async (t) => {
        const cliente = await repository.buscarClientePorId(dados.id_cliente, t);
        if (!cliente)
            throw erroNegocio("CLIENTE_NAO_EXISTE");

        const funcionario = await repository.buscarFuncionarioPorId(dados.id_funcionario, t);
        if (!funcionario)
            throw erroNegocio("FUNCIONARIO_NAO_EXISTE");

        // A entrega usa o endereço do cliente
        if (dados.tipo_entrega === "entrega" && !cliente.id_endereco)
            throw erroNegocio("ENDERECO_ENTREGA_OBRIGATORIO");

        const ids = [...quantidades.keys()];
        const produtos = await repository.buscarProdutosParaPedido(ids, t);
        const produtoPorId = new Map(produtos.map((p) => [p.id_produto, p]));

        const inexistentes = ids.filter((id) => !produtoPorId.has(id));
        if (inexistentes.length > 0)
            throw erroNegocio("PRODUTO_NAO_EXISTE", inexistentes.map((id) => ({ id_produto: id })));

        const inativos = produtos.filter((p) => !p.ativo);
        if (inativos.length > 0)
            throw erroNegocio("PRODUTO_INATIVO", inativos.map((p) => ({ id_produto: p.id_produto, nome: p.nome })));

        // Confere o estoque de todos antes de gravar qualquer coisa
        const semEstoque = [];
        for (const [id, solicitado] of quantidades) {
            const produto = produtoPorId.get(id);
            if (produto.qtd_estoque < solicitado) {
                semEstoque.push({
                    id_produto: id,
                    nome: produto.nome,
                    solicitado,
                    em_estoque: produto.qtd_estoque,
                });
            }
        }
        if (semEstoque.length > 0)
            throw erroNegocio("ESTOQUE_INSUFICIENTE", semEstoque);

        // Preço e subtotal vêm do banco, não do cliente
        const itens = [...quantidades].map(([id, quantidade]) => {
            const produto = produtoPorId.get(id);
            const precoUnitario = Number(produto.preco_venda);
            return {
                produto,
                id_produto: id,
                id_unidade_medida: produto.id_unidade_medida,
                quantidade,
                preco_unitario: precoUnitario,
                subtotal: arredondar(precoUnitario * quantidade),
            };
        });

        const valorTotal = arredondar(itens.reduce((soma, item) => soma + item.subtotal, 0));
        const ehEntrega = dados.tipo_entrega === "entrega";

        const pedido = await repository.criarPedido({
            id_cliente: cliente.id_cliente,
            id_funcionario: funcionario.id_funcionario,
            forma_pagamento: dados.forma_pagamento,
            tipo_entrega: dados.tipo_entrega,
            id_endereco_entrega: ehEntrega ? cliente.id_endereco : null,
            status_entrega: ehEntrega ? "pendente" : "nao_se_aplica",
            valor_total: valorTotal,
            observacoes: dados.observacoes || null,
        }, t);

        for (const item of itens) {
            await repository.criarItem({
                id_pedido: pedido.id_pedido,
                id_produto: item.id_produto,
                id_unidade_medida: item.id_unidade_medida,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario,
                subtotal: item.subtotal,
            }, t);

            await repository.baixarEstoque(item.produto, item.quantidade, t);
        }

        return pedido.id_pedido;
    });

    return repository.buscarPorId(idPedido);
}

module.exports = {
    listar,
    buscarPorId,
    criar,
};
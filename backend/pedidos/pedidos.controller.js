const services = require("./pedidos.service");

const FORMAS_PAGAMENTO = ["pix", "dinheiro", "cartao_debito", "cartao_credito"];
const TIPOS_ENTREGA = ["entrega", "retirada"];

function ehInteiroPositivo(valor) {
    const numero = Number(valor);
    return Number.isInteger(numero) && numero > 0;
}

function validarId(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ erro: "ID inválido" });
        return null;
    }
    return id;
}

// Devolve a lista de campos com problema (vazia se estiver tudo certo)
function validarPedido(corpo) {
    const { id_cliente, id_funcionario, forma_pagamento, tipo_entrega, itens } = corpo;
    const detalhes = [];

    if (!ehInteiroPositivo(id_cliente))
        detalhes.push({ campo: "id_cliente", mensagem: "Selecione o cliente" });

    if (!ehInteiroPositivo(id_funcionario))
        detalhes.push({ campo: "id_funcionario", mensagem: "Informe o funcionário responsável" });

    if (!forma_pagamento)
        detalhes.push({ campo: "forma_pagamento", mensagem: "Informe a forma de pagamento" });
    else if (!FORMAS_PAGAMENTO.includes(forma_pagamento))
        detalhes.push({ campo: "forma_pagamento", mensagem: "Forma de pagamento inválida" });

    if (!tipo_entrega)
        detalhes.push({ campo: "tipo_entrega", mensagem: "Informe se será entregue ou retirado" });
    else if (!TIPOS_ENTREGA.includes(tipo_entrega))
        detalhes.push({ campo: "tipo_entrega", mensagem: "Tipo de pedido inválido" });

    if (!Array.isArray(itens) || itens.length === 0) {
        detalhes.push({ campo: "itens", mensagem: "Adicione pelo menos um produto ao pedido" });
        return detalhes;
    }

    itens.forEach((item, i) => {
        if (!item || !ehInteiroPositivo(item.id_produto)) {
            detalhes.push({ campo: `itens[${i}].id_produto`, mensagem: "Produto inválido" });
            return;
        }

        const quantidade = item.quantidade;

        if (quantidade === undefined || quantidade === null || quantidade === "") {
            detalhes.push({ campo: `itens[${i}].quantidade`, mensagem: "Informe a quantidade de produtos" });
            return;
        }

        const numero = Number(quantidade);

        if (typeof quantidade === "boolean" || !Number.isInteger(numero))
            detalhes.push({ campo: `itens[${i}].quantidade`, mensagem: "A quantidade deve ser um número inteiro" });
        else if (numero <= 0)
            detalhes.push({ campo: `itens[${i}].quantidade`, mensagem: "A quantidade do produto deve ser um número positivo" });
    });

    return detalhes;
}

// Monta só o que o service precisa, já limpo e com o tipo certo
function montarPedido(corpo) {
    return {
        id_cliente: Number(corpo.id_cliente),
        // TODO(login): trocar pelo funcionário que vem do token, não do corpo da requisição
        id_funcionario: Number(corpo.id_funcionario),
        forma_pagamento: corpo.forma_pagamento,
        tipo_entrega: corpo.tipo_entrega,
        observacoes: corpo.observacoes ? String(corpo.observacoes).trim().slice(0, 255) : null,
        itens: corpo.itens.map((item) => ({
            id_produto: Number(item.id_produto),
            quantidade: Number(item.quantidade),
        })),
    };
}

async function listar(req, res) {
    try {
        const pedidos = await services.listar();
        return res.status(200).json(pedidos);
    } catch (erro) {
        console.log("Erro ao buscar pedidos:", erro);
        return res.status(500).json({ erro: "Não foi possível carregar os pedidos." });
    }
}

async function buscarPorId(req, res) {
    const id = validarId(req, res);
    if (id === null) return;

    try {
        const pedido = await services.buscarPorId(id);
        return res.status(200).json(pedido);
    } catch (erro) {
        if (erro.message === "PEDIDO_NAO_EXISTE") {
            return res.status(404).json({ erro: "Pedido não encontrado" });
        }

        console.log("Erro ao buscar pedido:", erro);
        return res.status(500).json({ erro: "Não foi possível carregar o pedido." });
    }
}

async function criar(req, res) {
    const corpo = req.body || {};
    const detalhes = validarPedido(corpo);

    if (detalhes.length > 0) {
        return res.status(400).json({ erro: "Dados inválidos", detalhes });
    }

    try {
        const pedido = await services.criar(montarPedido(corpo));

        return res.status(201).json({
            mensagem: "Pedido registrado com sucesso",
            pedido
        });
    } catch (erro) {
        if (erro.message === "CLIENTE_NAO_EXISTE") {
            return res.status(400).json({ erro: "Cliente não encontrado" });
        }
        if (erro.message === "FUNCIONARIO_NAO_EXISTE") {
            return res.status(400).json({ erro: "Funcionário não encontrado" });
        }
        if (erro.message === "ENDERECO_ENTREGA_OBRIGATORIO") {
            return res.status(400).json({
                erro: "Este cliente não tem endereço cadastrado. Cadastre o endereço ou escolha retirada."
            });
        }
        if (erro.message === "PRODUTO_NAO_EXISTE") {
            return res.status(400).json({
                erro: "Um ou mais produtos não existem mais. Atualize a lista e tente de novo."
            });
        }
        if (erro.message === "PRODUTO_INATIVO") {
            const nomes = erro.detalhes.map((p) => p.nome).join(", ");
            return res.status(409).json({ erro: `Produto inativo: ${nomes}` });
        }
        if (erro.message === "ESTOQUE_INSUFICIENTE") {
            const detalhesEstoque = erro.detalhes.map((p) => ({
                campo: `produto_${p.id_produto}`,
                mensagem: `Saldo insuficiente no estoque: ${p.nome} | ${p.solicitado} unidades solicitadas e ${p.em_estoque} em estoque`
            }));

            return res.status(409).json({
                erro: detalhesEstoque.map((d) => d.mensagem).join("; "),
                detalhes: detalhesEstoque
            });
        }
        if (erro.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ erro: "Cliente, funcionário ou produto inexistente" });
        }

        console.log("Erro ao registrar pedido:", erro);
        return res.status(500).json({
            erro: "Não foi possível registrar o pedido. Tente novamente."
        });
    }
}

const STATUS_PAGAMENTO = ["aguardando_pagamento", "pago"];

async function atualizarPagamento(req, res) {
    const id = validarId(req, res);
    if (id === null) return;

    const status = (req.body || {}).status_pagamento;

    if (!STATUS_PAGAMENTO.includes(status)) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [{ campo: "status_pagamento", mensagem: "Informe aguardando_pagamento ou pago" }]
        });
    }

    try {
        const pedido = await services.atualizarPagamento(id, status);

        return res.status(200).json({
            mensagem: "Status de pagamento atualizado com sucesso",
            pedido
        });
    } catch (erro) {
        if (erro.message === "PEDIDO_NAO_EXISTE") {
            return res.status(404).json({ erro: "Pedido não encontrado" });
        }
        if (erro.message === "PEDIDO_NAO_EDITAVEL") {
            return res.status(409).json({ erro: "Só é possível alterar o pagamento de pedidos em aberto." });
        }

        console.log("Erro ao atualizar pagamento:", erro);
        return res.status(500).json({ erro: "Não foi possível atualizar o pagamento. Tente novamente." });
    }
}

async function cancelar(req, res) {
    const id = validarId(req, res);
    if (id === null) return;

    try {
        const pedido = await services.cancelar(id);

        return res.status(200).json({
            mensagem: "Pedido cancelado com sucesso",
            pedido
        });
    } catch (erro) {
        if (erro.message === "PEDIDO_NAO_EXISTE") {
            return res.status(404).json({ erro: "Pedido não encontrado" });
        }
        if (erro.message === "PEDIDO_NAO_CANCELAVEL") {
            return res.status(409).json({ erro: "Só é possível cancelar pedidos em aberto." });
        }

        console.log("Erro ao cancelar pedido:", erro);
        return res.status(500).json({ erro: "Não foi possível cancelar o pedido. Tente novamente." });
    }
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizarPagamento,
    cancelar
};
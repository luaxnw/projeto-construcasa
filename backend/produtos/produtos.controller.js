const services = require("./produtos.service");

function ehInteiroPositivo(valor) {
    const numero = Number(valor);
    return Number.isInteger(numero) && numero > 0;
}

function ehNumeroNaoNegativo(valor) {
    if (valor === undefined || valor === null || valor === "") return false;
    const numero = Number(valor);
    return Number.isFinite(numero) && numero >= 0;
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
function validarProduto(corpo) {
    const { nome, id_categoria, preco_venda, id_unidade_medida, qtd_estoque } = corpo;
    const detalhes = [];

    if (!nome || !String(nome).trim())
        detalhes.push({ campo: "nome", mensagem: "Obrigatório" });

    if (!ehInteiroPositivo(id_categoria))
        detalhes.push({ campo: "id_categoria", mensagem: "Obrigatório" });

    if (!ehInteiroPositivo(id_unidade_medida))
        detalhes.push({ campo: "id_unidade_medida", mensagem: "Obrigatório" });

    if (!ehNumeroNaoNegativo(preco_venda))
        detalhes.push({ campo: "preco_venda", mensagem: "Informe um valor maior ou igual a zero" });

    if (qtd_estoque !== undefined) {
        const quantidade = Number(qtd_estoque);
        if (!Number.isInteger(quantidade) || quantidade < 0)
            detalhes.push({ campo: "qtd_estoque", mensagem: "Informe um número inteiro maior ou igual a zero" });
    }

    return detalhes;
}

// Monta só o que o banco precisa, já limpo e com o tipo certo
function montarProduto(corpo) {
    const produto = {
        nome: String(corpo.nome).trim(),
        descricao: corpo.descricao ? String(corpo.descricao).trim() : null,
        id_categoria: Number(corpo.id_categoria),
        id_unidade_medida: Number(corpo.id_unidade_medida),
        preco_venda: Number(corpo.preco_venda),
    };

    if (corpo.qtd_estoque !== undefined) produto.qtd_estoque = Number(corpo.qtd_estoque);
    if (corpo.ativo !== undefined) produto.ativo = Boolean(corpo.ativo);

    return produto;
}

async function listar(req, res) {
    try {
        const produtos = await services.listar();
        return res.status(200).json(produtos);
    } catch (erro) {
        console.log("Erro ao buscar produtos:", erro);
        return res.status(500).json({ erro: "Não foi possível carregar os produtos." });
    }
}

async function buscarPorId(req, res) {
    const id = validarId(req, res);
    if (id === null) return;

    try {
        const produto = await services.buscarPorId(id);
        return res.status(200).json(produto);
    } catch (erro) {
        if (erro.message === "PRODUTO_NAO_EXISTE") {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }

        console.log("Erro ao buscar produto:", erro);
        return res.status(500).json({ erro: "Não foi possível carregar o produto." });
    }
}

async function criar(req, res) {
    const detalhes = validarProduto(req.body);

    if (detalhes.length > 0) {
        return res.status(400).json({ erro: "Dados inválidos", detalhes });
    }

    try {
        const produto = await services.criar(montarProduto(req.body));

        return res.status(201).json({
            mensagem: "Produto cadastrado com sucesso",
            produto
        });
    } catch (erro) {
        if (erro.message === "PRODUTO_JA_EXISTE") {
            return res.status(409).json({ erro: "Já existe um produto com esse nome" });
        }
        if (erro.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ erro: "Categoria ou unidade de medida inexistente" });
        }

        console.log("Erro ao cadastrar produto:", erro);
        return res.status(500).json({
            erro: "Não foi possível cadastrar o produto. Tente novamente."
        });
    }
}

async function substituir(req, res) {
    const id = validarId(req, res);
    if (id === null) return;

    const detalhes = validarProduto(req.body);

    if (detalhes.length > 0) {
        return res.status(400).json({ erro: "Dados inválidos", detalhes });
    }

    try {
        const produto = await services.substituir(id, montarProduto(req.body));

        return res.status(200).json({
            mensagem: "Produto atualizado com sucesso",
            produto
        });
    } catch (erro) {
        if (erro.message === "PRODUTO_NAO_EXISTE") {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }
        if (erro.message === "NOME_JA_EXISTE") {
            return res.status(409).json({ erro: "Já existe um produto com esse nome" });
        }
        if (erro.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ erro: "Categoria ou unidade de medida inexistente" });
        }

        console.log("Erro ao atualizar produto:", erro);
        return res.status(500).json({
            erro: "Não foi possível atualizar o produto. Tente novamente."
        });
    }
}

async function excluir(req, res) {
    const id = validarId(req, res);
    if (id === null) return;

    try {
        await services.excluir(id);
        return res.status(204).send();
    } catch (erro) {
        if (erro.message === "PRODUTO_NAO_EXISTE") {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }
        if (erro.name === "SequelizeForeignKeyConstraintError") {
            return res.status(409).json({
                erro: "Não é possível excluir: este produto está em pedidos. Desative-o em vez de excluir."
            });
        }

        console.log("Erro ao excluir produto:", erro);
        return res.status(500).json({
            erro: "Não foi possível excluir o produto. Tente novamente."
        });
    }
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    substituir,
    excluir
};
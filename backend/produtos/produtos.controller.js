const services = require("./produtos.service");

async function listar(req, res) {
    try {
        const produtos = await services.listar();
        return res.status(200).json(produtos);
    } catch (erro) {
        console.log("Erro ao buscar produtos:", erro);
        return res.status(500).json({
            erro: erro.message
        });
    }
}

async function listarPorID(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: "ID inválido"
        });
    }

    try {
        const produto = await services.listarPorID(id);

        if (!produto) {
            return res.status(404).json({
                erro: `Produto de ID ${id} não existe`
            });
        }

        return res.status(200).json(produto);
    } catch (erro) {
        console.log("Erro ao buscar produto:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function criar(req, res) {
    const {
        nome,
        descricao,
        id_categoria,
        preco_venda,
        id_unidade_medida,
        ativo
    } = req.body;

    if (!nome || (id_categoria === undefined || id_categoria < 0) || (preco_venda === undefined || preco_venda < 0 ) 
        || (id_unidade_medida === undefined || id_unidade_medida < 0)) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                (id_categoria === undefined || id_categoria < 0) && { campo: "id_categoria", mensagem: "Obrigatório" },
                (preco_venda === undefined || preco_venda < 0) && { campo: "preco_venda", mensagem: "Obrigatório" },
                (id_unidade_medida === undefined || id_unidade_medida < 0) && { campo: "id_unidade_medida", mensagem: "Obrigatório" }
            ].filter(Boolean)
        });
    }

    try {
        const produto = await services.criar({
            nome,
            descricao,
            id_categoria,
            preco_venda,
            id_unidade_medida,
            ativo
        });

        return res.status(201).json({
            mensagem: "Produto cadastrado com sucesso",
            produto
        });
    } catch (erro) {
        if (erro.message === "PRODUTO_JA_EXISTE") {
            return res.status(409).json({
                erro: "Produto já cadastrado"
            });
        }

        console.log("Erro ao cadastrar produto:", erro);
        return res.status(500).json({
            erro: erro.message
        });
    }
}

async function substituir(req, res) {
    const {
        nome,
        descricao,
        id_categoria,
        preco_venda,
        id_unidade_medida,
        ativo
    } = req.body;

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: "ID inválido"
        });
    }

    if (!nome || (id_categoria === undefined || id_categoria < 0) || (preco_venda === undefined || preco_venda < 0 ) 
        || (id_unidade_medida === undefined || id_unidade_medida < 0)) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                (id_categoria === undefined || id_categoria < 0) && { campo: "id_categoria", mensagem: "Obrigatório" },
                (preco_venda === undefined || preco_venda < 0) && { campo: "preco_venda", mensagem: "Obrigatório" },
                (id_unidade_medida === undefined || id_unidade_medida < 0) && { campo: "id_unidade_medida", mensagem: "Obrigatório" }
            ].filter(Boolean)
        });
    }

    try {
        const produto = await services.substituir(id, {
            nome,
            descricao,
            id_categoria,
            preco_venda,
            id_unidade_medida,
            ativo
        });

        return res.status(200).json({
            mensagem: "Produto atualizado com sucesso",
            produto
        });
    } catch (erro) {
        if (erro.message === "PRODUTO_NAO_EXISTE") {
            return res.status(404).json({
                erro: "Produto não encontrado"
            });
        }

        if (erro.message === "NOME_JA_EXISTE") {
            return res.status(409).json({
                erro: "Nome já cadastrado"
            });
        }

        console.log("Erro ao atualizar produto:", erro);
        return res.status(500).json({
            erro: erro.message
        });
    }
}

async function excluir(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: "ID inválido"
        });
    }

    try {
        await services.excluir(id);
        return res.status(204).send();
    } catch (erro) {
        if (erro.message === "PRODUTO_NAO_EXISTE") {
            return res.status(404).json({
                erro: "Produto não encontrado"
            });
        }

        console.log("Erro ao excluir produto:", erro);
        return res.status(500).json({
            erro: erro.message
        });
    }
}

module.exports = {
    listar,
    listarPorID,
    criar,
    substituir,
    excluir
};

const services = require('./produtos.services');

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
            console.log(`Produto de ${id} não localizado`);
            return res.status(404).json({
                erro: `Produto de ${id} não localizado`
            });
        }
        return res.status(200).json(produto);

    } catch (erro) {
        console.log("Erro ao buscar produto:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function criar(req, res) {
    const { nome, descricao, categoria, preco, unidade_medida,
        fator_conversao } = req.body;

    if (!nome || !preco) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                !preco && { campo: "preco", mensagem: "Obrigatório" }
            ].filter(Boolean)
        });
    }

    try {
        const produto = await services.criar({
            nome,
            descricao,
            categoria,
            preco,
            unidade_medida,
            fator_conversao
        });

        return res.status(201).json({
            mensagem: "Produto cadastrado com sucesso",
            cliente: produto
        });

    } catch (erro) {
        if (erro.message === "NOME_JA_EXISTE") {
            console.log(`Produto de nome ${nome} já cadastrado`);
            return res.status(409).json({
                erro: "Produto já cadastrado"
            });
        }

        else {
            console.log("Erro ao cadastrar cliente", erro);
            return res.status(500).json({
                erro: erro.message
            });
        }
    }
}

async function substituir(req, res) {
    const { nome, descricao, categoria, preco, unidade_medida,
        fator_conversao } = req.body;

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: "ID inválido"
        });
    }

    if (!nome || !preco) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                !preco && { campo: "preco", mensagem: "Obrigatório" }
            ].filter(Boolean)
        });
    }

    try {
        const produto = await services.substituir(
            id,
            {
                nome,
                descricao,
                categoria,
                preco,
                unidade_medida,
                fator_conversao
            });

        return res.status(200).json({
            mensagem: "Produto atualizado com sucesso",
            produto: produto
        });

    } catch (erro) {
        if (erro.message === "PRODUTO_NAO_EXISTE") {
            console.log("Produto não encontrado");
            return res.status(404).json({
                erro: "Produto não econtrado"
            });
        }

        if (erro.message === "NOME_JA_EXISTE") {
            console.log(`Nome ${email} já cadastrado`);
            return res.status(409).json({
                erro: "Nome já cadastrado"
            });
        }

        else {
            console.log("Erro ao atualizar produto", erro);
            return res.status(500).json({
                erro: erro.message
            });
        }
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
        res.status(204).send();
    } catch (erro) {
        if (erro.message === "PRODUTO_NAO_EXISTE") {
            console.log("Produto não encontrado");
            return res.status(404).json({
                erro: "Produto não econtrado"
            });
        }
        else {
            console.log("Erro ao excluir produto", erro);
            return res.status(500).json({
                erro: erro.message
            });
        }
    }
}

module.exports = {
    listar,
    listarPorID,
    criar,
    substituir,
    excluir
}
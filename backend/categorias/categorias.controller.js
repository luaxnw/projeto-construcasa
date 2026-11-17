const services = require("./categorias.service");

function validarId(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ erro: "ID inválido" });
        return null;
    }
    return id;
}

async function listar(req, res) {
    try {
        const categorias = await services.listar();
        return res.status(200).json(categorias);
    } catch (erro) {
        console.log("Erro ao buscar categorias:", erro);
        return res.status(500).json({ erro: "Não foi possível carregar as categorias." });
    }
}

async function listarPorID(req, res) {
    const id = validarId(req, res);
    if (id === null) return;

    try {
        const categoria = await services.listarPorID(id);

        if (!categoria) {
            return res.status(404).json({ erro: "Categoria não encontrada" });
        }
        return res.status(200).json(categoria);
    } catch (erro) {
        console.log("Erro ao buscar categoria:", erro);
        return res.status(500).json({ erro: "Não foi possível carregar a categoria." });
    }
}

async function criar(req, res) {
    const { nome, descricao, ativa } = req.body;

    if (!nome || !nome.trim()) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [{ campo: "nome", mensagem: "Obrigatório" }]
        });
    }

    try {
        const categoria = await services.criar({
            nome: nome.trim(),
            descricao: descricao || null,
            ativa: ativa === undefined ? true : Boolean(ativa)
        });

        return res.status(201).json({
            mensagem: "Categoria cadastrada com sucesso",
            categoria
        });
    } catch (erro) {
        if (erro.message === "NOME_JA_EXISTE") {
            return res.status(409).json({ erro: "Já existe uma categoria com esse nome" });
        }

        console.log("Erro ao cadastrar categoria", erro);
        return res.status(500).json({
            erro: "Não foi possível cadastrar a categoria. Tente novamente."
        });
    }
}

async function substituir(req, res) {
    const id = validarId(req, res);
    if (id === null) return;

    const { nome, descricao, ativa } = req.body;

    if (!nome || !nome.trim()) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [{ campo: "nome", mensagem: "Obrigatório" }]
        });
    }

    try {
        const categoria = await services.substituir(id, {
            nome: nome.trim(),
            descricao: descricao || null,
            ativa: ativa === undefined ? true : Boolean(ativa)
        });

        return res.status(200).json({
            mensagem: "Categoria atualizada com sucesso",
            categoria
        });
    } catch (erro) {
        if (erro.message === "CATEGORIA_NAO_EXISTE") {
            return res.status(404).json({ erro: "Categoria não encontrada" });
        }
        if (erro.message === "NOME_JA_EXISTE") {
            return res.status(409).json({ erro: "Já existe uma categoria com esse nome" });
        }

        console.log("Erro ao atualizar categoria", erro);
        return res.status(500).json({
            erro: "Não foi possível atualizar a categoria. Tente novamente."
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
        if (erro.message === "CATEGORIA_NAO_EXISTE") {
            return res.status(404).json({ erro: "Categoria não encontrada" });
        }
        if (erro.name === "SequelizeForeignKeyConstraintError") {
            return res.status(409).json({
                erro: "Não é possível excluir: há produtos usando esta categoria."
            });
        }

        console.log("Erro ao excluir categoria", erro);
        return res.status(500).json({
            erro: "Não foi possível excluir a categoria. Tente novamente."
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
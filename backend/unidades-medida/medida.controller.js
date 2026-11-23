const service = require('./medida.service');

async function listar(req, res) {
    try {
        const medidas = await service.listar();
        return res.status(200).json(medidas);

    } catch (erro) {
        return res.status(400).json({ erro: erro.message });
    }
}

async function buscarPorId(req, res) {
    const id = parseInt(req.params.id);

    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({
            erro: "ID inválido"
        })

    try {
        const medida = await service.buscarPorId(id);

        return res.status(200).json(medida);

    } catch (erro) {
        if (erro.message === "MEDIDA_NAO_EXISTE")
            return res.status(404).json({
                erro: `Medida de ID ${id} não existe`
            });

        return res.status(500).json({ erro: erro.message });
    }
}

async function buscarPorNome(req, res) {
    try {
        const nome = req.body.nome;
        if (!nome) {
            return res.status(400)
                .json({ nome: "obrigatório" });
        }

        const medida = await service.buscarPorNome(nome);
        return res.status(200).json(medida);

    } catch (erro) {
        if (erro.message === "MEDIDA_NAO_EXISTE")
            return res.status(404).json({
                erro: `Medida de nome ${nome} não existe`
            });

        return res.status(500).json({ erro: erro.message });
    }
}

async function criar(req, res) {
    const { nome, sigla } = req.body;

    if (!nome || !sigla) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                !sigla && { campo: "sigla", mensagem: "Obrigatório" },
            ].filter(Boolean)
        });
    }

    try {
        const medida = await service.criar({
            nome,
            sigla,
        });

        return res.status(201).json({
            mensagem: "Medida cadastrada com sucesso",
            medida
        });

    } catch (erro) {
        if (erro.message === "MEDIDA_JA_EXISTE")
            return res.status(409).json({
                erro: "Medida já cadastrada no sistema. Medida não salva"
            });

        return res.status(500).json({
            erro: erro.message
        });
    }
}

async function atualizar(req, res) {
    const id = parseInt(req.params.id);

    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({
            erro: "ID inválido"
        });

    const { nome, sigla } = req.body;

    if (!nome || !sigla) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                !sigla && { campo: "sigla", mensagem: "Obrigatório" },
            ].filter(Boolean)
        });
    }

    try {
        const medida = await service.atualizar(id, {
            nome,
            sigla
        });

        return res.status(200).json({
            mensagem: "Medida atualizada com sucesso",
            medida
        });

    } catch (erro) {
        if (erro.message === "NOME_JA_EXISTE")
            return res.status(409).json({
                erro: `Medida chamada ${nome} já cadastrada`
            });

        if (erro.message === "MEDIDA_NAO_EXISTE")
            return res.status(409).json({
                erro: `Medida com ID ${id} não existe no sistema`
            });

        return res.status(500).json({
            erro: erro.message
        });
    }
}

async function deletar(req, res) {
    const id = parseInt(req.params.id);

    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({
            erro: "ID inválido"
        });

    try {
        await service.deletar(id);

        return res.status(204).send();

    } catch (erro) {
        if (erro.message === "MEDIDA_NAO_EXISTE")
            return res.status(404).json({
                erro: `Medida de ID ${id} não existe`
            });

        return res.status(500).json({
            erro: erro.message
        });
    }
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    atualizar,
    deletar
};
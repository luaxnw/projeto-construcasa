const service = require("./funcionarios.service");

async function listar(req, res) {
    try {
        const funcionarios = await service.listar();
        return res.status(200).json(funcionarios);
    } catch (erro) {
        return res.status(500).json({
            erro: erro.message
        });
    }
}

async function buscarPorId(req, res) {
    const id = parseInt(req.params.id);

    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({
            erro: "ID inválido"
        });

    try {
        const funcionario = service.buscarPorId(id);
        return res.status(200).json(funcionario);
    } catch (erro) {
        if (erro.message === "FUNCIONARIO_NAO_EXISTE")
            return res.status(404).json({
                erro: `Funcionário de id ${id} não existe`
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

        const funcionario = await service.buscarPorNome(nome);
        return res.status(200).json(funcionario);

    } catch (erro) {
        if (erro.message === "FUNCIONARIO_NAO_EXISTE")
            return res.status(404).json({
                erro: `Funcionário de nome ${nome} não existe`
            });

        return res.status(500).json({ erro: erro.message });
    }
}

async function buscarPorCpf(req, res) {
    try {
        const cpf = req.body.cpf;
        if (!cpf) {
            return res.status(400)
                .json({ cpf: "obrigatório" });
        }

        const funcionario = await service.buscarPorCpf(cpf);
        return res.status(200).json(funcionario);

    } catch (erro) {
        if (erro.message === "FUNCIONARIO_NAO_EXISTE")
            return res.status(404).json({
                erro: `Funcionário de CPF ${cpf} não existe`
            });

        return res.status(500).json({ erro: erro.message });
    }
}



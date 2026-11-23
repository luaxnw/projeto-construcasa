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
        const funcionario = await service.buscarPorId(id);
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
    const cpf = req.body.cpf;
    if (!cpf) {
        return res.status(400)
            .json({ cpf: "obrigatório" });
    }

    try {
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

async function criar(req, res) {
    const { nome, cpf, senha, cargo, id_role } = req.body;

    if (!nome || !cpf || !senha || !cargo || !id_role) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                !cpf && { campo: "cpf", mensagem: "Obrigatório" },
                !senha && { campo: "senha", mensagem: "Obrigatório" },
                !cargo && { campo: "cargo", mensagem: "Obrigatório" },
                !id_role && { campo: "role", mensagem: "Obrigatório" }
            ].filter(Boolean)
        });
    }

    const cpfNormalizado = cpf.replace(/[.\-/]/g, ""); // normaliza cpf

    try {
        const funcionario = await service.criar({
            nome,
            cpf: cpfNormalizado,
            senha,
            cargo,
            id_role: Number(id_role)
        });

        return res.status(201).json({
            mensagem: "Funcionário cadastrada com sucesso",
            funcionario
        });

    } catch (erro) {
        if (erro.message === "NOME_JA_EXISTE")
            return res.status(409).json({
                erro: `Funcionário de nome ${nome} já cadastrada no sistema. Funcionário não salvo`
            });
        if (erro.message === "CPF_JA_EXISTE")
            return res.status(409).json({
                erro: `Funcionário de CPF ${cpf} já cadastrado no sistema. Funcionário não salvo`
            });

        return res.status(500).json({
            erro: erro.message
        });
    }
}

async function substituir(req, res) {
    const id = parseInt(req.params.id);

    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({
            erro: "ID inválido"
        });

    const { nome, cpf, senha, cargo, id_role } = req.body;

    if (!nome || !cpf || !senha || !cargo || !id_role) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                !cpf && { campo: "cpf", mensagem: "Obrigatório" },
                !senha && { campo: "senha", mensagem: "Obrigatório" },
                !cargo && { campo: "cargo", mensagem: "Obrigatório" },
                !id_role && { campo: "role", mensagem: "Obrigatório" }
            ].filter(Boolean)
        });
    }

    const cpfNormalizado = cpf.replace(/[.\-/]/g, ""); // normaliza cpf

    try {
        const funcionario = await service.substituir(id, {
            nome,
            cpf: cpfNormalizado,
            senha,
            cargo,
            id_role: Number(id_role)
        });

        return res.status(200).json({
            mensagem: "Funcionário atualizado com sucesso.",
            funcionario
        });

    } catch (erro) {
        if (erro.message === "NOME_JA_EXISTE")
            return res.status(409).json({
                erro: `Funcionário de nome ${nome} já cadastrado no sistema. Funcionário não atualizado.`
            });

        if (erro.message === "CPF_JA_EXISTE")
            return res.status(409).json({
                erro: `Funcionário de CPF ${cpf} já cadastrado no sistema. Funcionário não atualizado.`
            })

        if (erro.message === "FUNCIONARIO_NAO_EXISTE")
            return res.status(404).json({
                erro: `Funcionário com ID ${id} não existe no sistema.`
            });

        return res.status(500).json({
            erro: erro.message
        });
    }
}

async function excluir(req, res) {
    const id = parseInt(req.params.id);

    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({
            erro: "ID inválido"
        });

    try {
        await service.deletar(id);

        return res.status(204).send();

    } catch (erro) {
        if (erro.message === "FUNCIONARIO_NAO_EXISTE")
            return res.status(404).json({
                erro: `Funcionário de ID ${id} não existe`
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
    buscarPorCpf,
    criar,
    substituir,
    excluir
};

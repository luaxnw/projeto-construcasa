const services = require('./clientes.service');

async function listar(req, res) {
    try {
        const clientes = await services.listar();
        return res.status(200).json(clientes);
    } catch (erro) {
        console.log("Erro ao buscar clientes:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function buscarPorId(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: "ID inválido"
        });
    }

    try {
        const cliente = await services.buscarPorId(id);

        if (!cliente) {
            console.log(`Cliente de ${id} não localizado`);
            return res.status(404).json({
                erro: `Cliente de ${id} não localizado`
            });
        }
        return res.status(200).json(cliente);

    } catch (erro) {
        console.log("Erro ao buscar cliente:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function criar(req, res) {
    const { nome, cpf_cnpj, email, telefone, endereco } = req.body;

    if (!nome || !telefone) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                !telefone && { campo: "telefone", mensagem: "Obrigatório" }
            ].filter(Boolean)
        });
    }

    try {
        const cliente = await services.criar({
            nome,
            cpf_cnpj,
            email,
            telefone,
            endereco
        });

        return res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso",
            cliente: cliente
        });

    } catch (erro) {
        if (erro.message === "EMAIL_JA_EXISTE") {
            return res.status(409).json({ erro: "Email já cadastrado" });
        }

        if (erro.message === "TELEFONE_JA_EXISTE") {
            return res.status(409).json({ erro: "Telefone já cadastrado" });
        }

        if (erro.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ erro: "CPF/CNPJ já cadastrado" });
        }

        console.log("Erro ao cadastrar cliente", erro);
        return res.status(500).json({
            erro: "Não foi possível cadastrar o cliente. Tente novamente."
        });
    }
}

async function substituir(req, res) {
    const { nome, cpf_cnpj, email, telefone, endereco } = req.body;
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido" });
    }

    if (!nome || !telefone) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                !telefone && { campo: "telefone", mensagem: "Obrigatório" }
            ].filter(Boolean)
        });
    }

    try {
        const cliente = await services.substituir(id, {
            nome,
            cpf_cnpj,
            email,
            telefone,
            endereco
        });

        return res.status(200).json({
            mensagem: "Cliente atualizado com sucesso",
            cliente: cliente
        });

    } catch (erro) {
        if (erro.message === "CLIENTE_NAO_EXISTE") {
            return res.status(404).json({ erro: "Cliente não encontrado" });
        }
        if (erro.message === "EMAIL_JA_EXISTE") {
            return res.status(409).json({ erro: "Email já cadastrado" });
        }
        if (erro.message === "TELEFONE_JA_EXISTE") {
            return res.status(409).json({ erro: "Telefone já cadastrado" });
        }
        if (erro.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ erro: "CPF/CNPJ já cadastrado" });
        }

        console.log("Erro ao atualizar cliente", erro);
        return res.status(500).json({
            erro: "Não foi possível atualizar o cliente. Tente novamente."
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
        res.status(204).send();
    } catch (erro) {
        if (erro.message === "CLIENTE_NAO_EXISTE") {
            console.log("Cliente não encontrado");
            return res.status(404).json({
                erro: "Cliente não econtrado"
            });
        }
        else {
            console.log("Erro ao excluir cliente", erro);
            return res.status(500).json({
                erro: erro.message
            });
        }
    }
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    substituir,
    excluir
};
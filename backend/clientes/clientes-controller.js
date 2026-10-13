const { deflate } = require('node:zlib');
const services = require('./clientes-services');

async function listar(req, res) {
    try {
        const clientes = await services.listar();
        return res.status(200).json(clientes);
    } catch (erro) {
        console.log("Erro ao buscar clientes:", erro);
        return res.status(500).json({ erro: erro.message });
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
        const cliente = await services.listarPorID(id);

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
    const { nome, email, telefone, endereco } = req.body;

    if (!nome || !email || !telefone || !endereco) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                !email && { campo: "email", mensagem: "Obrigatório" },
                !telefone && { campo: "telefone", mensagem: "Obrigatório" },
                !endereco && { campo: "endereco", mensagem: "Obrigatório" },
            ].filter(Boolean)
        });
    }

    try {
        const cliente = await services.criar({
            nome,
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
            console.log(`Email ${email} já cadastrado`);
            return res.status(409).json({
                erro: "Email já cadastrado"
            });
        }

        else if (erro.message === "TELEFONE_JA_EXISTE") {
            console.log(`Telefone ${telefone} já cadastrado`);
            return res.status(409).json({
                erro: "Telefone já cadastrado"
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
    const { nome, email, telefone, endereco } = req.body;
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: "ID inválido"
        });
    }

    if (!nome || !email || !telefone || !endereco) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: [
                !nome && { campo: "nome", mensagem: "Obrigatório" },
                !email && { campo: "email", mensagem: "Obrigatório" },
                !telefone && { campo: "telefone", mensagem: "Obrigatório" },
                !endereco && { campo: "endereco", mensagem: "Obrigatório" },
            ].filter(Boolean)
        });
    }

    try {
        const cliente = await services.substituir(
            id,
            {
                nome,
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
            console.log("Cliente não encontrado");
            return res.status(404).json({
                erro: "Cliente não econtrado"
            });
        }

        else if (erro.message === "EMAIL_JA_EXISTE") {
            console.log(`Email ${email} já cadastrado`);
            return res.status(409).json({
                erro: "Email já cadastrado"
            });
        }

        else if (erro.message === "TELEFONE_JA_EXISTE") {
            console.log(`Telefone ${telefone} já cadastrado`);
            return res.status(409).json({
                erro: "Telefone já cadastrado"
            });
        }

        else {
            console.log("Erro ao atualizar cliente", erro);
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
        if (erro.message === "CLIENTE_NAO_EXISTE") {
            console.log("Cliente não encontrado");
            return res.status(404).json({
                erro: "Cliente não econtrado"
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

module.exports = {
    listar,
    listarPorID,
    criar,
    substituir,
    excluir
};
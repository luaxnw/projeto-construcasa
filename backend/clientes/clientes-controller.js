const services = require('./clientes-services');

async function listarClientes(req, res) {
    try {
        const clientes = await services.listarClientes();
        return res.status(200).json(clientes);
    } catch (erro) {
        console.log("Erro ao buscar clientes:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function listarClientePorID(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
            console.log("ID informado não é inteiro");
            return res.status(400).json({
                erro: "ID informado não é inteiro"
            });
        }
        const cliente = await services.listarClientePorID(id);

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

async function criarCliente(req, res) {
    const { nome, email, telefone, endereco } = req.body;

    try {
        const cliente = await services.criarCliente({
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

module.exports = {
    listarClientes,
    listarClientePorID,
    criarCliente
};
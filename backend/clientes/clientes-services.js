const repository = require('./clientes-repository');

async function listarClientes() {
    return repository.listarClientes;
}

async function listarClientePorID(id) {
    return repository.listarClientePorID(id)
}

async function listarClientePorEmail(email) {
    return repository.listarClientePorEmail(email);
}

async function listarClientePorTelefone(telefone) {
    return repository.listarClientePorTelefone(telefone);
}

async function criarCliente(cliente) {
    if (await listarClientePorEmail(cliente.email)) {
        throw new Error("EMAIL_JA_EXISTE");
    }

    if (await listarClientePorTelefone(cliente.telefone)) {
        throw new Error("TELEFONE_JA_EXISTE");
    }

    return repository.criarCliente(cliente);
}

module.exports = {
    listarClientes,
    listarClientePorID,
    listarClientePorEmail,
    listarClientePorTelefone,
    criarCliente
};
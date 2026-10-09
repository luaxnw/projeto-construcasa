const repository = require('./clientes-repository');

async function listar() {
    return repository.listar;
}

async function listarPorID(id) {
    return repository.listarPorID(id)
}

async function listarPorEmail(email) {
    return repository.listarPorEmail(email);
}

async function listarPorTelefone(telefone) {
    return repository.listarPorTelefone(telefone);
}

async function criar(cliente) {
    if (await listarPorEmail(cliente.email)) {
        throw new Error("EMAIL_JA_EXISTE");
    }

    if (await listarPorTelefone(cliente.telefone)) {
        throw new Error("TELEFONE_JA_EXISTE");
    }

    return repository.criarCliente(cliente);
}

module.exports = {
    listar,
    listarPorID,
    listarPorEmail,
    listarPorTelefone,
    criar
};
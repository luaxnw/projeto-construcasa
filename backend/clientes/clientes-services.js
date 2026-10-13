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

    return repository.criar(cliente);
}

async function substituir(id, cliente) {
    if (!await listarPorID(id)) {
        throw new Error("CLIENTE_NAO_EXISTE");
    }

    const clienteEmail = await listarPorEmail(cliente.email);

    if (clienteEmail && clienteEmail.id !== id) {
        throw new Error("EMAIL_JA_EXISTE");
    }

    const clienteTelefone = await listarPorTelefone(cliente.telefone);

    if (clienteTelefone && clienteTelefone.id !== id) {
        throw new Error("TELEFONE_JA_EXISTE");
    }

    return repository.substituir(id, cliente);
}

async function excluir(id) {
    if (!await listarPorID(id)) {
        throw new Error("CLIENTE_NAO_EXISTE");
    }

   return repository.excluir(id);
}

module.exports = {
    listar,
    listarPorID,
    listarPorEmail,
    listarPorTelefone,
    criar,
    substituir,
    excluir
};
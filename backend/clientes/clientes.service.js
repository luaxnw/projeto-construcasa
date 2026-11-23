const repository = require('./clientes.repository');

async function listar() {
    return repository.listar();
}

async function listarPorID(id) {
    return repository.buscarPorId(id);
}

async function listarPorEmail(email) {
    return repository.buscarPorEmail(email);
}

async function listarPorTelefone(telefone) {
    return repository.buscarPorTelefone(telefone);
}

async function criar(cliente) {
    if (cliente.email && await listarPorEmail(cliente.email)) {
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

    if (cliente.email) {
        const clienteEmail = await listarPorEmail(cliente.email);
        if (clienteEmail && clienteEmail.id_cliente !== id) {
            throw new Error("EMAIL_JA_EXISTE");
        }
    }

    const clienteTelefone = await listarPorTelefone(cliente.telefone);
    if (clienteTelefone && clienteTelefone.id_cliente !== id) {
        throw new Error("TELEFONE_JA_EXISTE");
    }

    await repository.substituir(id, cliente);
    return listarPorID(id);
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
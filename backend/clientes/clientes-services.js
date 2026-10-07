const clientesRepository = require('./clientes-repository');

async function listarClientes() {
    return clientesRepository.listarClientes;
};

async function listarClientePorID(id) {
    return clientesRepository.listarClientePorID(id)
};

async function listarClientePorEmail(email) {
    return clientesRepository.listarClientePorEmail(email);
};

async function criarCliente(cliente) {
    return clientesRepository.criarCliente(cliente);
};

module.exports = {
    listarClientes,
    listarClientePorID,
    listarClientePorEmail,
    criarCliente
};
const clientesRepository = require('./clientes-repository');

function listarClientes() {
    return clientesRepository.listarClientes;
};

function procurarUsuarioPorID(id) {
    return clientesRepository.listarClientesPorID()
};

function procurarUsuarioPorEmail(email) {
    return db.usuarios.find((u) => u.email === email);
};

function cadastrarUsuario(nome, email, senha) {

    if (procurarUsuarioPorEmail(email))
        throw new Error("Email já está cadastrado no sistema");

    const usuarioNovo = {
        id: db.proximoIdUsuario++,
        nome: nome,
        email: email,
        senha: senha
    };

    db.usuarios.push(usuarioNovo);

    return usuarioNovo;
};

module.exports = {
    listarClientes,

};
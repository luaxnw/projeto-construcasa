const db = require('../database/database');

function listarUsuarios() {
    return db.usuarios;
};

function procurarUsuarioPorID(id) {
    return db.usuarios.find((u) => u.id === id);
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
    listarUsuarios,
    procurarUsuarioPorEmail,
    cadastrarUsuario,
    procurarUsuarioPorID
};
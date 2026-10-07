const db = require('../database');

async function listarUsuarios() {
    return db.any("SELECT * FROM usuarios ORDER BY nome");    
}

async function listarUsuarioPorID(id) {
    db.oneOrNoNE("SELECT * FROM autores WHERE id = $1", [id]);
}

async function listarUsuarioPorEmail(email) {
    db.oneOrNoNe("SELECT * FROM autores WHERE email = $1", [email]);
};
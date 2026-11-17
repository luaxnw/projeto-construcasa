const { Categoria, Sequelize } = require("../database/models");

async function listar() {
    return Categoria.findAll({ order: [["nome", "ASC"]] });
}

async function buscarPorId(id) {
    return Categoria.findByPk(id);
}

async function buscarPorNome(nome) {
    return Categoria.findOne({
        where: Sequelize.where(
            Sequelize.fn("lower", Sequelize.col("nome")),
            Sequelize.fn("lower", nome)
        ),
    });
}

async function criar(dados) {
    return Categoria.create(dados);
}

async function substituir(id, dados) {
    return Categoria.update(dados, { where: { id_categoria: id } });
}

async function excluir(id) {
    return Categoria.destroy({ where: { id_categoria: id } });
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    substituir,
    excluir
};
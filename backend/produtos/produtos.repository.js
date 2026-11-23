const { Produto, Categoria, UnidadeMedida, Sequelize } = require("../database/models");

// Traz junto o nome da categoria e a sigla da unidade
const INCLUIR = [
    { model: Categoria, as: "categoria", attributes: ["id_categoria", "nome"] },
    { model: UnidadeMedida, as: "unidades_medida", attributes: ["id_unidade_medida", "nome", "sigla"] },
];

async function listar() {
    return Produto.findAll({ include: INCLUIR, order: [["nome", "ASC"]] });
}

async function buscarPorId(id) {
    return Produto.findByPk(id, { include: INCLUIR });
}

async function buscarPorNome(nome) {
    return Produto.findOne({
        where: Sequelize.where(
            Sequelize.fn("lower", Sequelize.col("Produto.nome")),
            Sequelize.fn("lower", nome)
        ),
    });
}

async function criar(dados) {
    return Produto.create(dados);
}

async function substituir(id, dados) {
    return Produto.update(dados, { where: { id_produto: id } });
}

async function excluir(id) {
    return Produto.destroy({ where: { id_produto: id } });
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    substituir,
    excluir
};
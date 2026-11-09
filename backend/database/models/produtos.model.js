const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Produto = sequelize.define(
    "Produto",
    {
        id_produto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.TEXT,
        },
        id_categoria: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        preco_venda: {
            type: DataTypes.NUMERIC(10, 2),
            allowNull: false,
        },
        id_unidade_medida: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: "produtos",
        timestamps: true,
        underscored: true,
    },
);

Produto.associate = (db) => {
    //Produto.belongsTo(db.Categoria, {
    //    foreignKey: "id_categoria",
    //    as: "categorias"
    //});

    Produto.belongsTo(db.UnidadeMedida, {
        foreignKey: "id_unidade_medida",
        as: "unidades_medida"
    });

    Produto.hasMany(db.ItemPedido, {
        foreignKey: "id_produto",
        as: "itens_pedido"
    });
}

module.exports = Produto;
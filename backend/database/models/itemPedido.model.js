const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemPedido = sequelize.define(
    "ItemPedido",
    {
        id_item_pedido: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_pedido: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_produto: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_unidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantidade: {
            type: DataTypes.DECIMAL(12, 3),
            allowNull: false
        },
        precoUnitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
    },
    {
        tableName: "itens_pedido",
        timestamps: true,
        underscored: true
    }
);

ItemPedido.associate = (db) => {
    ItemPedido.belongsTo(db.Pedido, {
        foreignKey: "id_pedido",
        as: "pedidos"
    });

    ItemPedido.belongsTo(db.Produto, {
        foreignKey: "id_produto",
        as: "produto"
    });

    ItemPedido.belongsTo(db.UnidadeMedida, {
        foreignKey: "id_unidade",
        as: "unidades_medida"
    });
}

module.exports = ItemPedido;
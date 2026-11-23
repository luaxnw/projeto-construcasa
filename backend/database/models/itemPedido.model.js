const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

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
        id_unidade_medida: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantidade: {
            type: DataTypes.DECIMAL(12, 3),
            allowNull: false
        },
        preco_unitario: {
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
        as: "produtos"
    });

    ItemPedido.belongsTo(db.UnidadeMedida, {
        foreignKey: "id_unidade_medida",
        as: "unidades_medida"
    });
}

module.exports = ItemPedido;
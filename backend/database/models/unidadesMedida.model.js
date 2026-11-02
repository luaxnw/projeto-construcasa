const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UnidadeMedida = sequelize.define(
    "UnidadeMedida",
    {
        id_unidade: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        sigla: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        }

    },
    {
        tableName: "unidades_medida",
        timestamps: true,
        underscored: true
    }
);

UnidadeMedida.associate = (db) => {
    UnidadeMedida.hasMany(db.Produto, {
        foreignKey: "id_unidade_medida",
        as: "produtos"
    });

    UnidadeMedida.hasMany(db.ItemPedido, {
        foreignKey: "id_unidade_medida",
        as: "item_pedido"
    });
};

module.exports = UnidadeMedida;
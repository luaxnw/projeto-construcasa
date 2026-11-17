const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Categoria = sequelize.define(
    "Categoria",
    {
        id_categoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        descricao: {
            type: DataTypes.STRING(255),
        },
        ativa: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: "categorias",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        underscored: true
    },
);

module.exports = Categoria;
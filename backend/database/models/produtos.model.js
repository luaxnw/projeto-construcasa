const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Produto = sequelize.define(
    "Produto",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "id"
        },
        nome: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
            field: "nome"
        },
        descricao: {
            type: DataTypes.STRING(255),
            field: "descricao"
        },
        categoria: {
            type: DataTypes.STRING(30),
            field: "categoria"
        },
        preco: {
            type: DataTypes.NUMERIC(6,2),
            allowNull: false,
            field: "preco"
        },
        unidade_medida: {
            type: DataTypes.STRING(10),
            field: "unidade_medida"
        },
        fator_conversao: {
            type: DataTypes.STRING(10),
            field: "fator_conversao"
        },

    },
    {
        timestamps: false,
        tableName: "produtos",
    },
);

module.exports = Produto;
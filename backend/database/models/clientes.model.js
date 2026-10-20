const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Cliente = sequelize.define(
    "Cliente",
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
            field: "nome"
        },
        cpf: {
            type: DataTypes.STRING(11),
            allowNull: true,
            unique: true,
            field: "cpf"
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: true,
            unique: true,
            field: "email"
        },
        telefone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true,
            field: "telefone"
        },
        endereco: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: "endereco"
        },
    },
    {
        timestamps: false,
        tableName: "clientes",
    },
);

module.exports = Cliente;
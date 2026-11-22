const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Cliente = sequelize.define(
    "Cliente",
    {
        id_cliente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        cpf_cnpj: {
            type: DataTypes.STRING(20),
            unique: true,
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
        },
        telefone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        id_endereco: {
            type: DataTypes.INTEGER
        },
    },
    {
        tableName: "clientes",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        underscored: true
    },
);

Cliente.associate = (db) => {
    Cliente.belongsTo(db.Endereco, {
        foreignKey: "id_endereco",
        as: "enderecos"
    });
}

module.exports = Cliente;
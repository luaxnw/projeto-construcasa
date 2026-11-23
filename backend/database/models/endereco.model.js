const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Endereco = sequelize.define(
    "Endereco",
    {
        id_endereco: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rua: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        numero: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        bairro: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        cidade: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        complemento: {
            type: DataTypes.STRING(100)
        },
        ponto_referencia: {
            type: DataTypes.STRING(150)
        }
    },
    {
        tableName: "enderecos",
        timestamps: true,
        underscored: true
    }
);

Endereco.associate = (db) => {
    Endereco.hasMany(db.Cliente, {
        foreignKey: "id_endereco",
        as: "clientes"
    });
}

module.exports = Endereco;
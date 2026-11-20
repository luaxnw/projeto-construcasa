const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Funcionario = sequelize.define(
    "Funcionario",
    {
        id_funcionario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        cpf: {
            type: DataTypes.STRING(14),
            allowNull: false,
            unique: true,
        },
        senha_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        cargo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        id_role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: "funcionarios",
        timestamps: false,
        underscored: true
    },
);

Funcionario.associate = (db) => {
    Funcionario.belongsTo(db.Role, {
        foreignKey: "id_role",
        as: "roles"
    });
}

module.exports = Funcionario;
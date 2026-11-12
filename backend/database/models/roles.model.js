const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Role = sequelize.define(
    "Role",
    {
        id_role: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }
    },
    {
        tableName: "roles",
        timestamps: true,
        underscored: true
    }
);

Role.associate = (db) => {
    Role.hasMany(db.Funcionario, {
        foreignKey: "id_role",
        as: "funcionarios"
    });
};

module.exports = Role;
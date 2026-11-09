const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Pedido = sequelize.define(
    "Pedido",
    {
        id_pedido: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_cliente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_funcionario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        forma_pagamento: {
            type: DataTypes.STRING(15),
            allowNull: false,
            default: 'pix'
        },
        tipo_entrega: {
            type: DataTypes.STRING(10),
            allowNull: false,
            default: 'retirada'
        },
        id_endereco_entrega: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status_pagamento: {
            type: DataTypes.STRING(25),
            allowNull: false,
            default: 'aguardando_pagamento'
        },
        status_entrega: {
            type: DataTypes.STRING(25),
            allowNull: false,
            default: 'nao_se_aplica'
        },
        status_pedido: {
            type: DataTypes.STRING(25),
            allowNull: false,
            default: 'em_aberto'
        },
        valor_total: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false,
            default: 0
        },
        observacoes: {
            type: DataTypes.STRING(255)
        },
    },
    {
        tableName: "pedidos",
        timestamps: true,
        underscored: true
    }
);

Pedido.associate = (db) => {
    Pedido.belongsTo(db.Cliente, {
        foreignKey: "id_cliente",
        as: "clientes"
    });

    //Pedido.belongsTo(db.Funcionario, {
    //    foreignKey: "id_funcionario",
    //    as: "funcionarios"
   // });

    Pedido.belongsTo(db.Endereco, {
        foreignKey: "id_endereco_entrega",
        as: "enderecos"
    });

    Pedido.hasMany(db.ItemPedido, {
        foreignKey: "id_pedido",
        as: "pedidos"
    });
}

module.exports = Pedido;
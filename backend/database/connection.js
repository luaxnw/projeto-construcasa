const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("construcasa", "dev", "010506", {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false, 
});

module.exports = sequelize;
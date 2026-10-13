const pgp = require("pg-promise")();

const db = pgp("postgres://dev:010506@localhost:5432/construcasa");

module.exports = db;

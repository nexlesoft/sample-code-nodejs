const dotenv = require('dotenv').config();

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME,
    },
    pool: {min: 0, max: 7}
});

module.exports = {
    DB: knex
};
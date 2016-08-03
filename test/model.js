module.exports = require('knex')({
    client: 'pg',
    connection: 'postgres://localhost:5432/gulp_knex_test'
});
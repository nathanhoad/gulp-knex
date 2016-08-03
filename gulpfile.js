const Gulp = require('gulp');
const Knex = require('./test/model');


require('./lib')(Gulp, Knex, {
    migrations: `${__dirname}/test/migrations`,
    models: `${__dirname}/test/models`
});
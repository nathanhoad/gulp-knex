const Gulp = require('gulp');
const Knex = require('./test/model');


require('./lib')(Gulp, Knex, {
    migrationsPath: `${__dirname}/test/migrations`,
    modelsPath: `${__dirname}/test/models`
});
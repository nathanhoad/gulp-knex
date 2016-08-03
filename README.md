# Gulp Knex

Sets up some basic Gulp tasks for Knex migrations.


## Usage

In your Gulp file:

```javascript
const Gulp = require('gulp');
const Knex = require('knex')({ ...blah... });

require('gulp-knex')(Gulp, Knex);
```


```javascript
const Gulp = require('gulp');
const Knex = require('knex')({ ...blah... });

require('gulp-knex')(Gulp, Knex, {
    migrationsPath: './migrations', // Defaults to APP_ROOT + '/migrations'
    modelsPath: './models', // Defaults to APP_ROOT + '/app/server/models'
    schemaTable: 'schema_migrations' // Defaults to 'schema_migrations'
});
```


## Testing

1. Create a Postgres database called `gulp_knex_test`.
2. Run `npm test`.
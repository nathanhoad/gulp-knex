# Gulp Knex

Sets up some basic Gulp tasks for Knex migrations.

**NOTE:** Generated Models use [http://npmjs.com/package/gimmea](Gimmea) to 
generate their UUID keys.


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
    migrations: './migrations', // Defaults to APP_ROOT + '/migrations'
    models: './models', // Defaults to APP_ROOT + '/app/server/models'
    schemaTable: 'schema_migrations' // Defaults to 'schema_migrations'
});
```

**NOTE:** `models` can also be `false` if you don't want/need model files to be generated.


## Testing

1. Create a Postgres database called `gulp_knex_test`.
2. Run `npm test`.
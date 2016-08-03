const Util = require('gulp-util');
const Path = require('path');
const FS = require('fs');
const Args = require('yargs').argv;
const Inflect = require('i')();

const APP_ROOT = require('app-root-path');

const Templates = require('./templates');


var options = {
    migrationsPath: Path.resolve(`${APP_ROOT}/migrations`),
    modelsPath: Path.resolve(`${APP_ROOT}/app/server/models`),
    tableName: 'schema_migrations'
}


module.exports = (Gulp, Knex, new_options) => {
    options = {
        directory: new_options.migrationsPath || options.migrationsPath,
        modelsDirectory: new_options.modelsPath || options.modelsPath,
        tableName: new_options.schemaTable || options.tableName
    };


    Gulp.task('migrate:make', () => {
        if (Args.name) {
            Knex.migrate.make(Inflect.dasherize(Args.name), options).then((migration_path) => {
                var template = Templates.MIGRATION;
                
                FS.writeFileSync(migration_path, template);
                
                Util.log('Created new migration', Util.colors.green(migration_path.replace(options.directory, '')));
                process.exit();
            }).catch(err => {
                Util.log(Util.colors.red(err.message));
            });
            
        } else if (Args.model) {
            let table_name = Inflect.tableize(Args.model);
            
            Knex.migrate.make(`create-${Inflect.dasherize(table_name)}`, options).then((migration_path) => {
                var template = Templates.MODEL_MIGRATION;
                template = template.replace(/{{TABLE}}/g, table_name);
                FS.writeFileSync(migration_path, template);
                
                Util.log('Created new migration', Util.colors.green(migration_path.replace(options.directory, '')));
                
                var model_path = `${options.modelsDirectory}/${Inflect.dasherize(Inflect.singularize(table_name))}.js`;
                template = Templates.MODEL;
                
                template = template.replace(/{{TABLE}}/g, table_name);
                template = template.replace(/{{MODEL}}/g, Inflect.classify(Args.model));
                
                FS.writeFileSync(model_path, template);
                Util.log("Created new model", Util.colors.green(model_path.replace(options.modelsDirectory, '')));
                
                process.exit();
            }).catch(err => {
                Util.log(Util.colors.red(err.message));
            });
            
        } else {
            Util.log("You need to specify a --name or --model argument");
            process.exit();
        }
    });


    Gulp.task('migrate:latest', () => {
        Knex.migrate.latest(options).then((results) => {
            if (results[1].length == 0) {
                Util.log(Util.colors.gray('No migrations to run'));
            } else {
                Util.log(Util.colors.green.bold(`Migrating group ${results[0]}`));
                results[1].forEach((migration_path) => {
                    Util.log('\t', Util.colors.green(migration_path.replace(Path.dirname(options.directory), '')));
                });
            }
            process.exit();
            
        }).catch((err) => {
            Util.log(Util.colors.red(err));
            process.exit();
        });
    });


    Gulp.task('migrate:rollback', () => {
        Knex.migrate.rollback(options).then((results) => {
            if (results[1].length == 0) {
                Util.log(Util.colors.gray('Nothing to rollback'));
            } else {
                Util.log(Util.colors.yellow.bold(`Rolling back group ${results[0]}`));
                results[1].forEach((migration_path) => {
                    Util.log('\t', Util.colors.yellow(migration_path.replace(Path.dirname(options.directory), '')));
                });
            }
            process.exit();
            
        }).catch((err) => {
            Util.log(Util.colors.red(err));
            process.exit();
        });
    });


    Gulp.task('migrate:version', () => {
        Knex.migrate.currentVersion(options).then((version) => {
            if (version == 'none') {
                Util.log(Util.colors.gray('No migrations have been run'));
            } else {
                Util.log('Database is at version', Util.colors.green(version));
            }
            process.exit()
        });
    });    
};
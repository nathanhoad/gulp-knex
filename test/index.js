const Async = require('async');
const FS = require('fs');
const exec = require('child_process').execSync;
const Should = require('should');

const Gulp = require('gulp');
const Knex = require('./model');


// NOTE: The lib is loaded in gulpfile.js


describe('Migrations:', function () {
    this.timeout(10000);
    
    
    beforeEach((done) => {
        Async.parallel({
            database (_done) {
                Knex.schema.dropTable('schema_migrations').then(() => _done()).catch(() => _done());
            },
            
            migrations (_done) {
                FS.readdirSync(`${__dirname}/migrations`).sort().forEach(function (file) {
                    if (file != '20160802224158_print-a-log.js' && file != '20160802224159_do-nothing.js') {
                        FS.unlinkSync(`${__dirname}/migrations/${file}`);
                    }
                });
                _done();
            },
            
            models (_done) {
                FS.readdirSync(`${__dirname}/models`).sort().forEach(function (file) {
                    if (file != '.gitkeep') {
                        FS.unlinkSync(`${__dirname}/models/${file}`);
                    }
                });
                _done();
            }
        }, () => {
            done();
        });
    });
    
    
    describe('gulp migrate:latest', () => {
        it('should run any pending migrations', (done) => {
            var output = exec('gulp migrate:latest').toString();
            
            Should(output).containEql('Migrating group');
            Should(output).containEql('20160802224158_print-a-log.js');
            Should(output).containEql('20160802224159_do-nothing.js');
            
            done();
        });
    });
    
    
    describe('gulp migrate:rollback', () => {
        it('should roll back the last migration group', (done) => {
            exec('gulp migrate:latest');
            
            var output = exec('gulp migrate:rollback').toString();
            
            Should(output).containEql('Rolling back group');
            Should(output).containEql('20160802224158_print-a-log.js');
            Should(output).containEql('20160802224159_do-nothing.js');
            
            done();
        });
    });
    
    
    describe('gulp migrate:version', () => {
        it('should get the version number', (done) => {
            exec('gulp migrate:latest');
            
            var output = exec('gulp migrate:version').toString();
            
            Should(output).containEql('Database is at version');
            Should(output).containEql('20160802224159');
            
            done();
        });
    });
    
    
    describe('gulp migrate:make --name', () => {
        it('should create a new migration file', (done) => {
            var output = exec('gulp migrate:make --name do_the_thing').toString();
            
            Should(output).containEql('Created new migration');
            Should(output).containEql('_do-the-thing.js');
            
            var migration_file_name = output.match(/(\d+\_do-the-thing\.js)/gm)[0];
            FS.access(`${__dirname}/migrations/${migration_file_name}`, FS.F_OK, (err) => {
                Should(err).be.null();
                
                output = exec('gulp migrate:latest').toString();
                
                Should(output).containEql('Migrating group');
                Should(output).containEql('_do-the-thing.js');
                
                done();
            });
        });
    });
    
    
    describe('gulp migrate:make --model', () => {
        it('should create a new migration file and a new model file', (done) => {
            Knex.schema.dropTableIfExists('things').then(() => {
                var output = exec('gulp migrate:make --model thing').toString();
                
                Should(output).containEql('Created new migration');
                Should(output).containEql('_create-things.js');
                
                Should(output).containEql('Created new model');
                Should(output).containEql('thing.js');
                
                var migration_file_name = output.match(/(\d+\_create-things\.js)/gm)[0];
                FS.access(`${__dirname}/migrations/${migration_file_name}`, FS.F_OK, (err) => {
                    Should(err).be.null();
                    
                    FS.access(`${__dirname}/models/thing.js`, FS.FS_OK, (err) => {
                        Should(err).be.null();
                        
                        output = exec('gulp migrate:latest').toString();
                        
                        Should(output).containEql('Migrating group');
                        Should(output).containEql('_create-things.js');
                        
                        done();
                    });
                });
            });
        });
    });
});
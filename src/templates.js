module.exports.MIGRATION = "module.exports = {\n\
    up (Knex, Promise) {\n\
        // TODO: return a Promise, eg. Knex.schema.table\n\
    },\n\
    \n\
    \n\
    down (Knex, Promise) {\n\
        // TODO: return a Promise, eg. Knex.schema.table\n\
    }\n\
};";


module.exports.MODEL_MIGRATION = "module.exports = { \n\
    up (Knex, Promise) {\n\
        return Knex.schema.createTable('{{TABLE}}', (table) => {\n\
            table.uuid('id');\n\
            // TODO: add other fields\n\
            \n\
            table.timestamps();\n\
            \n\
            table.primary('id');\n\
            table.index(['created_at']);\n\
            table.index(['updated_at']);\n\
        });\n\
    },\n\
    \n\
    \n\
    down (Knex, Promise) {\n\
        return Knex.schema.dropTable('{{TABLE}}');\n\
    }\n\
};";


module.exports.MODEL = "const Model = require('app/server/model');\n\
const Gimmea = require('gimmea');\n\
    \n\
    \n\
var {{MODEL}} = Model.extend({\n\
    tableName: '{{TABLE}}',\n\
    \n\
    \n\
    initialize () {\n\
        this.on('creating', () => {\n\
            this.attributes.id = this.attributes.id || Gimmea.uuid();\n\
        });\n\
    }\n\
});\n\
\n\
\n\
module.exports = {{MODEL}};";
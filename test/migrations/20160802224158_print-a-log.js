module.exports = { 
    up (Knex, Promise) {
        return new Promise((resolve, reject) => {
            console.log("\tUp");
            resolve();
        });
    },
    
    
    down (Knex, Promise) {
        return new Promise((resolve, reject) => {
            console.log("\tDown");
            resolve();
        });
    }    
};
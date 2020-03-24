
const pg = require('pg');

const config = {
    user: 'admin',
    password: 'Admin009*',
    host: '127.0.0.1',
    port : 5432,
    database : 'teamwork'
};
console.log("Connected successfully to the Teamwork Database")
const pool  = new pg.Pool(config);

module.exports =  pool;
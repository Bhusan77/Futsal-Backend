require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
});

pool.connect()  // Optional: to test connection
    .then(client => {
        console.log("PostgreSQL connection successful!");
        client.release();
    })
    .catch(err => console.error("PostgreSQL connection failed!", err));

module.exports = pool;
// Using pg for PostgreSQL interactions. (Ensure a "users" table exists.)
const pool = require("../db");

module.exports = {
    async createUser({ name, email, password, isAdmin }) {
        const result = await pool.query(
            "INSERT INTO users(name, email, password, isAdmin) VALUES($1, $2, $3, $4) RETURNING *",
            [name, email, password, isAdmin || false]
        );
        return result.rows[0];
    },
    async getUserByEmail(email) {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return result.rows[0];
    }
    // ...other functions as needed...
};
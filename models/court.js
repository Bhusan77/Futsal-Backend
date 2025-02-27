const pool = require("../db");

module.exports = {
    async getAllCourts() {
        const result = await pool.query("SELECT * FROM courts");
        return result.rows;
    },
    async getCourtById(id) {
        const result = await pool.query("SELECT * FROM courts WHERE id = $1", [id]);
        return result.rows[0];
    },
    async addCourt({ name, location, maxPlayers, price, imgURLs, type, description }) {
        const result = await pool.query(
            "INSERT INTO courts(name, location, maxPlayers, price, imgURLs, type, description) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
            [name, location, maxPlayers, price, imgURLs, type, description]
        );
        return result.rows[0];
    },
    async updateCourt(id, { courtId, name, location, maxPlayers, price, type, description, imgURLs }) {
        const result = await pool.query(
            "UPDATE courts SET courtId=$1, name=$2, location=$3, maxPlayers=$4, price=$5, type=$6, description=$7, imgURLs=$8 WHERE id=$9 RETURNING *",
            [courtId, name, location, maxPlayers, price, type, description, imgURLs, id]
        );
        return result.rows[0];
    },
    async deleteCourt(id) {
        await pool.query("DELETE FROM courts WHERE id = $1", [id]);
    }
};
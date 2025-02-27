const pool = require("../db");

module.exports = {
    async addBooking({ courtName, courtId, userId, date, maxPlayers, totalAmount, transactionId, status }) {
        const result = await pool.query(
            `INSERT INTO bookings 
             (court, courtid, userid, date, maxplayers, totalamount, transactionid, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [courtName, courtId, userId, date, maxPlayers, totalAmount, transactionId, status]
        );
        return result.rows[0];
    },

    async getBookingsByUserId(userId) {
        const result = await pool.query(
            "SELECT id, court, courtid, userid, date, maxplayers, totalamount, transactionid, status FROM bookings WHERE userid = $1",
            [userId]
        );
        return result.rows;
    },

    async cancelBooking(bookingId) {
        const result = await pool.query(
            "UPDATE bookings SET status = 'Cancelled' WHERE id = $1 RETURNING *",
            [bookingId]
        );
        return result.rows[0];
    },
};
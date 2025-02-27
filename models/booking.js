const pool = require("../db");

module.exports = {
    async addBooking({ court, courtId, userId, startDate, endDate, maxPlayers, totalHours, totalAmount, transactionId, status }) {
        const result = await pool.query(
            "INSERT INTO bookings(court, courtId, userId, startDate, endDate, maxPlayers, totalHours, totalAmount, transactionId, status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
            [court, courtId, userId, startDate, endDate, maxPlayers, totalHours, totalAmount, transactionId, status || "Booked"]
        );
        return result.rows[0];
    },
    async getBookingsByUserId(userId) {
        const result = await pool.query("SELECT * FROM bookings WHERE userId = $1", [userId]);
        return result.rows;
    },
    async cancelBooking(bookingId) {
        // For example, update status to "Cancelled"
        const result = await pool.query(
            "UPDATE bookings SET status = 'Cancelled' WHERE id = $1 RETURNING *",
            [bookingId]
        );
        return result.rows[0];
    }
    // ...other functions as needed...
};
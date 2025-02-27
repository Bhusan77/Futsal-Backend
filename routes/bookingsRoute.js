require('dotenv').config();

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const pool = require("../db");
const Booking = require("../models/booking");
const Court = require("../models/court");  // fix path if needed

// New Booking Court using dummy QR approach
router.post("/bookingCourt", async (req, res) => {
    const { court, userId, date, maxPlayers, totalAmount, courtId, courtName } = req.body;
    try {
        const transactionId = uuidv4();
        // Use the court's name if available, otherwise fallback to the passed courtName.
        const actualCourtId = (court && court._id) ? court._id : courtId;
        const actualCourtName = (court && court.name) ? court.name : courtName;

        const savedBooking = await Booking.addBooking({
            courtName: actualCourtName,
            courtId: actualCourtId,
            userId,
            date,
            maxPlayers,
            totalAmount,
            transactionId,
            status: "Pending"
        });

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(savedBooking.id)}&size=200x200`;
        return res.send({ dummyQR: qrUrl, bookingId: savedBooking.id });
    } catch (error) {
        console.error("Error in bookingCourt:", error);
        return res.status(400).json({ message: error.message });
    }
});

// New endpoint to confirm payment (booking)
router.post("/confirmPayment", async (req, res) => {
    const { bookingId, courtId } = req.body;
    try {
        // Update booking status to "Confirmed"
        // Here, reuse cancelBooking or create a dedicated update function.
        await Booking.cancelBooking(bookingId); // or updateBookingStatus(bookingId, 'Confirmed')
        // Directly update the bookings table as a dummy implementation:
        const result = await pool.query(
            "UPDATE bookings SET status = 'Confirmed' WHERE id = $1 RETURNING *",
            [bookingId]
        );
        // Update the current bookings on the court accordingly
        let currentCourt = await Court.getCourtById(courtId);
        const currentBookings = Array.isArray(currentCourt.currentbookings)
            ? currentCourt.currentbookings
            : (currentCourt.currentbookings ? JSON.parse(currentCourt.currentbookings) : []);
        const updatedBookings = currentBookings.map(booking => {
            if (booking.bookingId === bookingId) {
                return { ...booking, status: 'Confirmed' };
            }
            return booking;
        });
        await pool.query(
            "UPDATE courts SET currentbookings = $1 WHERE id = $2",
            [JSON.stringify(updatedBookings), courtId]
        );
        return res.send("Booking confirmed successfully");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Get Bookings By UserId
router.post("/getBookingsByUserId", async (req, res) => {
    const { userId } = req.body;
    try {
        const bookings = await Booking.getBookingsByUserId(userId);
        res.send(bookings);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Cancel Booking
router.post("/cancelBooking", async (req, res) => {
    const { bookingId, courtId } = req.body;
    try {
        await Booking.cancelBooking(bookingId);

        let currentCourt = await Court.getCourtById(courtId);
        const currentBookings = Array.isArray(currentCourt.currentbookings)
            ? currentCourt.currentbookings
            : (currentCourt.currentbookings ? JSON.parse(currentCourt.currentbookings) : []);
        const updatedBookings = currentBookings.filter((booking) => booking.bookingId !== bookingId);

        await pool.query(
            "UPDATE courts SET currentbookings = $1 WHERE id = $2",
            [JSON.stringify(updatedBookings), courtId]
        );

        return res.send("Your booking cancelled successfully");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Admin - Get All Bookings
router.get('/getAllBookings', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM bookings");
        res.send(result.rows);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = router;
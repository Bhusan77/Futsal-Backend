const express = require('express');
const router = express.Router();

const Court = require("../models/court");

// Get All Courts
router.get("/getAllCourts", async (req, res) => {
    try {
        const courts = await Court.getAllCourts();
        res.send(courts);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Get Court By ID
router.post("/getCourtById", async (req, res) => {
    const { courtId } = req.body;
    try {
        const court = await Court.getCourtById(courtId);
        if (!court) {
            return res.status(404).json({ message: "No court found" });
        }
        res.send(court);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Admin - Add New Court
router.post("/addCourt", async (req, res) => {
    try {
        const newCourt = await Court.addCourt(req.body);
        res.send("New Court added successfully");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Admin - Delete the Current Court
router.delete("/deleteCourt/:id", async (req, res) => {
    try {
        await Court.deleteCourt(req.params.id);
        res.send("Court deleted successfully");
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Admin - Update the Current Court
router.put('/updateCourt/:id', async (req, res) => {
    try {
        const updatedCourt = await Court.updateCourt(req.params.id, req.body);
        res.json({ message: "Court updated successfully", court: updatedCourt });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
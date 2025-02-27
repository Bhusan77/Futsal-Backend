const express = require('express');
const router = express.Router();

const User = require("../models/user");

// Registration
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const savedUser = await User.createUser({ name, email, password });
        res.send("User registered successfully!");
    } catch (error) {
        return res.status(400).json({ message: error.message || error });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existedUser = await User.getUserByEmail(email);
        if (existedUser && existedUser.password === password) {
            const userData = {
                name: existedUser.name,
                email: existedUser.email,
                isAdmin: existedUser.isadmin, // Postgres field names are usually lowercase
                _id: existedUser.id
            };
            res.send(userData);
        } else {
            return res.status(400).json({ message: "Login failed!" });
        }

    } catch (error) {
        return res.status(400).json({ message: error.message || error });
    }
});

// Admin - Get All Users
router.get("/getAllUsers", async (req, res) => {
    try {
        const currentUsers = await User.getAllUsers();
        res.send(currentUsers);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
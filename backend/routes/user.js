const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../routes/userAuth")

// sign-up
router.post("/sign-up", async (req, res) => {
    try {
        // Destructure the incoming request body
        const { username, email, password, address } = req.body;

        // Validate username length
        if (username.length < 4) {
            return res
                .status(400)
                .json({ message: "Username length should be greater than 3" });
        }

        // Check if the username already exists
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res
                .status(400)
                .json({ message: "Username already exists" });
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res
                .status(400)
                .json({ message: "Email already exists" });
        }

        // Validate password length
        if (password.length <= 5) {
            return res
                .status(400)
                .json({ message: "Password length should be greater than 5" });
        }
        const hasPass = await bcrypt.hash(password, 10);


        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hasPass,
            address
        });

        // Save the new user to the database
        await newUser.save();

        // Send success response
        return res.status(200).json({ message: "Sign up successful" });
    } catch (error) {
        // Catch any errors and send a 500 error response
        console.error(error.message); // Log the actual error message for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
});

// sign in
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            res.status(400).json({ message: "invalid credentials " });
        }
        await bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const authClaims = [
                    { name: existingUser.username },
                    { role: existingUser.role },
                ]
                const token = jwt.sign({ authClaims }, "bookStore123", {
                    expiresIn: "30d",
                })
                res.status(200).json({ id: existingUser._id, role: existingUser.role, token: token });
            }
            else {
                res.status(400).json({ message: "invalid credentials" });
            }
        })
    } catch (error) {
        // Catch any errors and send a 500 error response
        console.error(error.message);
        // Log the actual error message for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
});

// get user information
router.get("/get-user-information", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});

//update address
router.put("/update-address", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address });
        return res.status(200).json({ message: "addres updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
})
module.exports = router;

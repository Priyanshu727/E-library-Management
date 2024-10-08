const express = require('express');
const router = express.Router(); // This correctly initializes the router
const User = require("../models/user"); // Make sure to use the correct 'User' model
const Book = require("../models/book");
const { authenticateToken } = require("../routes/userAuth");

router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);

        if (user.role !== "admin") {
            return res.status(400).json({ message: "You are not an Admin" });
        }

        // Creating a new book
        const book = new Book({
            url: req.body.url,
            title: req.body.title, // Use req.body here, not res.body
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });

        // Save the book to the database
        await book.save();
        res.status(200).json({ message: "Book added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// update book
router.post("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findById(bookid, {

            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });

        // Save the book to the database

        return res.status(200).json({ message: "Book added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// delete book
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({
            message: "book deleted succescfully",
        });
        // Save the book to the database
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// get all books
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await book.find().sort({ createdAt: -1 });
        return res.json({
            status: "success",
            data: "books",
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// get recent added books limit
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await book.find().sort({ createdAt: -1 }).limit(4);
        return res.json({
            status: "success",
            data: "books",
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;

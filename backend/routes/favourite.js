const express = require('express'); // Import express
const router = express.Router(); // Correctly initialize the router
const User = require("../models/user");
const { authenticateToken } = require("../routes/userAuth");

// Add book to favourites
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);

        // Check if the book is already in favourites
        const isBookFavourite = userData.favourites.includes(bookid);
        if (isBookFavourite) {
            return res.status(200).json({
                message: "Book is already in favourites"
            });
        }

        // Add the book to favourites
        await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
        return res.status(200).json({ message: 'Book added to favourites' });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Remove book from favourites
router.delete("/remove-book-from-favourite", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);

        // Check if the book is in favourites
        const isBookFavourite = userData.favourites.includes(bookid);
        if (isBookFavourite) {
            // Remove the book from favourites
            await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
        }

        return res.status(200).json({ message: 'Book removed from favourites' });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;

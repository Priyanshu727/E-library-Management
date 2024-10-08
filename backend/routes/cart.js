const express = require('express');
const router = express.Router();  // Initialize router
const User = require("../models/user");
const { authenticateToken } = require('../routes/userAuth');

// Add to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookInCart = userData.cart.includes(bookid);

        if (isBookInCart) {
            return res.json({
                status: "success",
                message: "Book is already in cart",
            });
        }

        // Corrected typo: `findByIdAndUpadate` should be `findByIdAndUpdate`
        await User.findByIdAndUpdate(id, {
            $push: { cart: bookid },
        });

        return res.json({
            status: "Success",
            message: "Book added to cart",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;

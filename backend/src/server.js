const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const user = require('../routes/user');
const Books = require('../routes/book');
const Favourit = require("../routes/favourite");
const Cart = require("../routes/cart");
// Load environment variables
dotenv.config(); // Make sure this is at the top before any use of env variables

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

// routes
app.use("/api/v1", user);
app.use("/api/v1", Books);
app.use("/api/v1", Favourit);
app.use("/api/v1", Cart);

// Define the port from environment variables or use 8083 as default
const PORT = process.env.PORT || 8083;



app.listen(PORT, (err) => {
    if (err) {
        console.log(err, 'Server failed to start');
    } else {
        console.log(`Listening on port: http://localhost:${PORT}`);
    }
});

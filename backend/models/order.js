const mongoose = reequire("mongoose");

const order = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "usre",
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref:"book",
    },
    status: {
        type: String,
        default: "Order Placed",
        enum:["Order Placed","Out for delivery,Delivered,Canceled"],
    },
}, {timestamps:true}
);
module.exports = mongoose.model("order", order);
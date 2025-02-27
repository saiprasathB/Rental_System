const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema({
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "Host", required: true },
    title: String ,
    vehicleType: String,
    location: String,
    price: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Rental", RentalSchema);

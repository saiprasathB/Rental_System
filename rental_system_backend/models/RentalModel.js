const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema({
    hostId: String,
    title: String,
    vehicleType: String,
    location: String,
    latitude: Number, // Store latitude
    longitude: Number, // Store longitude
    price: Number
});

module.exports = mongoose.model("Rental", RentalSchema);

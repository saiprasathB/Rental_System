const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  rentalId: { type: mongoose.Schema.Types.ObjectId, ref: "Rental", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model("Booking", BookingSchema);

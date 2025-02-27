const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
    firstName:  String,
    lastName:String,
    email:  String,
    password: String,
    documents: String,
    isVerified: { type: Boolean, default: false } 
});

module.exports = mongoose.model("Host", hostSchema);

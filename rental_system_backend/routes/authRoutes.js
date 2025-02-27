const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


router.post("/signup", async (req, res) => {
    try {
        const { name, email, password} = req.body;

       
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        user = new User({ name, email, password: hashedPassword });
        await user.save();
         console.log(req.body)
        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});




router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Received login request for email:", email);

        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found in database.");
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const pass= await bcrypt.compare(password,user.password)
        if (!pass) {
            console.log("Incorrect password.");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("Login successful for:", user.email);
        res.json({ user });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = router;

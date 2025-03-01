const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Host=require("../models/BecomeHost");
const Rental=require("../models/RentalModel")

const router = express.Router();



router.post("/signup", async (req, res) => {
    console.log("Received data:", req.body); 
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        res.json({ userId: newUser._id, message: "Signup successful" });
    } catch (error) {
        console.error("Signup error:", error); 
        res.status(500).json({ error: "Server error" });
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Incorrect password.");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("Login successful for:", user.email);
        
        res.json({ userId: user._id, name: user.name, email: user.email });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});




router.post("/becomehost", async (req, res) => {
    try {
        const { name, email, password, Documents } = req.body;

        if (!name || !email || !password || !Documents) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        console.log("Received host application for:", email);
        let existingHost = await Host.findOne({ email });
        if (existingHost) {
            return res.status(400).json({ msg: "You have already applied for host verification." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       
        const newHost = new Host({
            name,
            email,
            password: hashedPassword,
            Documents,
            isVerified: false 
        });

        await newHost.save();

        console.log("New host application submitted:", email);
        res.status(201).json({ msg: "Application submitted successfully. Waiting for verification." });

    } catch (error) {
        console.error("Error in Become Host:", error);
        res.status(500).json({ msg: "Server error" });
    }
});




router.post("/alreadyahost", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Host login attempt for:", email);

        const host = await Host.findOne({ email });
        if (!host) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

      
        if (!host.isVerified) {
            return res.status(403).json({ message: "Verification Pending" });
        }

      
        const isMatch = await bcrypt.compare(password, host.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("Host login successful:", host._id);

        res.json({
            message: "Login Successful",
            hostId: host._id,
            isVerified: host.isVerified 
        });

    } catch (error) {
        console.error("Host Login Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});





router.post("/postrental", async (req, res) => {
    try {
        const { hostId, title, vehicleType, location, price } = req.body;

        if (!hostId) return res.status(400).json({ msg: "Host ID is required" });

    
        const host = await Host.findById(hostId);
        if (!host) {
            return res.status(404).json({ msg: "Host not found" });
        }
        if (!host.isVerified) {
            return res.status(403).json({ msg: "Host is not verified. Cannot post rental." });
        }

       
        const rental = new Rental({
            hostId,
            title,
            vehicleType,
            location,
            price
        });

        await rental.save();
        res.status(201).json({ msg: "Rental posted successfully!" });

    } catch (error) {
        console.error("Error posting rental:", error);
        res.status(500).json({ msg: "Server error" });
    }
});




router.get("/rentaldata", async (req, res) => {
    try {
        const rentaldata = await Rental.find();
        res.status(200).json(rentaldata); 
        console.log("Fetched rental data:", rentaldata); 
    } catch (error) {
        console.error("Error in getting details:", error);
        res.status(500).json({ error: "Server error" });
    }
});










module.exports = router;

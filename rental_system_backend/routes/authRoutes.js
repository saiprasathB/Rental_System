const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Host=require("../models/BecomeHost");
const Rental=require("../models/RentalModel")
const Booking = require("../models/Bookings");

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
        const { hostId, title, vehicleType, location, latitude, longitude, price } = req.body;

        if (!hostId) return res.status(400).json({ msg: "Host ID is required" });

        // Check if host exists and is verified
        const host = await Host.findById(hostId);
        if (!host) {
            return res.status(404).json({ msg: "Host not found" });
        }
        if (!host.isVerified) {
            return res.status(403).json({ msg: "Host is not verified. Cannot post rental." });
        }

        // Ensure latitude and longitude are provided
        if (!latitude || !longitude) {
            return res.status(400).json({ msg: "Latitude and Longitude are required" });
        }

        // Create rental entry
        const rental = new Rental({
            hostId,
            title,
            vehicleType,
            location,
            latitude,
            longitude,
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
        const { latitude, longitude } = req.query;

        let rentaldata = await Rental.find();

        if (latitude && longitude) {
            const userLat = parseFloat(latitude);
            const userLon = parseFloat(longitude);
            const radius = 10; // 10 km radius

            rentaldata = rentaldata.filter((rental) => {
                if (rental.latitude && rental.longitude) {
                    const rentalLat = rental.latitude;
                    const rentalLon = rental.longitude;

                    // Calculate distance using Haversine formula
                    const toRad = (value) => (value * Math.PI) / 180;
                    const R = 6371; // Earth radius in km

                    const dLat = toRad(rentalLat - userLat);
                    const dLon = toRad(rentalLon - userLon);
                    const a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(toRad(userLat)) * Math.cos(toRad(rentalLat)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const distance = R * c;

                    return distance <= radius;
                }
                return false;
            });
        }

        res.status(200).json(rentaldata);
    } catch (error) {
        console.error("Error in getting details:", error);
        res.status(500).json({ error: "Server error" });
    }
});




router.get("/rentaldata/:id", async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id);
      res.json(rental);
    } catch (error) {
      res.status(500).json({ error: "Error fetching rental details" });
    }
  });
  
  
  router.post("/book", async (req, res) => {
    try {
        const { rentalId, userId, date } = req.body;
        console.log(req.body)
       
        const existingBooking = await Booking.findOne({ rentalId, date });

        if (existingBooking) {
            console.log("exists");
            return res.status(201).json({ message: "This rental is already booked for the selected date." });
            
        }
         
        
        const newBooking = new Booking({ rentalId, userId, date });
        await newBooking.save()
        console.log("booked");

        res.status(201).json({ message: "Booking successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error booking rental.", error });
    }
});










module.exports = router;

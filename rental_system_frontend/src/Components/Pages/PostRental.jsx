import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/PostRental.css";

function PostRental() {
    const [title, setTitle] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hostId = localStorage.getItem("hostId");  
        const isVerified = localStorage.getItem("hostVerified");

        if (!hostId) {
            alert("You must be logged in as a host to post a rental.");
            return;
        }

        if (!isVerified) {
            alert("Your account is not verified yet. Please wait for approval.");
            return;
        }

        if (price <= 0) {
            alert("Price must be a positive number.");
            return;
        }

        try {
            console.log("Posting rental with hostId:", hostId);

            const res = await axios.post("https://rental-system-cyan.vercel.app/postrental", {
                hostId,
                title,
                vehicleType,
                location,
                price: Number(price)
            });

            alert("Rental posted successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error posting rental:", error);
            alert("Failed to post rental: " + (error.response?.data?.message || "Server error. Try again."));
        }
    };

    return (
        <div className="post-rental-container">
            <h2>Post a Rental</h2>
            <form onSubmit={handleSubmit} className="post-rental-form">
                <input
                    type="text"
                    placeholder="Rental Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Vehicle Type (Car, Bike, etc.)"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Price per Day"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="1"
                />
                <button type="submit">Post Rental</button>
            </form>
        </div>
    );
}

export default PostRental;

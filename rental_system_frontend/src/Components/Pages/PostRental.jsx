import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

            const res = await axios.post("https://rental-system-backend-ioto.onrender.com/postrental", {
                hostId,
                title,
                vehicleType,
                location,
                price: Number(price)  // Ensure price is sent as a number
            });

            alert("Rental posted successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error posting rental:", error);
            alert("Failed to post rental: " + (error.response?.data?.message || "Server error. Try again."));
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Post a Rental</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "400px", margin: "auto" }}>
                <input
                    type="text"
                    placeholder="Rental Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
                />
                <input
                    type="text"
                    placeholder="Vehicle Type (Car, Bike, etc.)"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    required
                    style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
                />
                <input
                    type="number"
                    placeholder="Price per Day"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="1"
                    style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
                />
                <button
                    type="submit"
                    style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                >
                    Post Rental
                </button>
            </form>
        </div>
    );
}

export default PostRental;

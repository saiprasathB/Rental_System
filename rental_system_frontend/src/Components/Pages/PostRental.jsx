import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/PostRental.css";

function PostRental() {
    const [title, setTitle] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const navigate = useNavigate();

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setLatitude(lat);
                    setLongitude(lon);
    
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
                        );
                        const data = await response.json();
    
                        if (data && data.display_name) {
                            setLocation(data.display_name);
                        } else {
                            alert("Could not fetch an accurate address. Try again.");
                        }
                    } catch (error) {
                        console.error("Error fetching address:", error);
                        alert("Failed to get address.");
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Location access denied. Please enable location services.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };
    
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
            const res = await axios.post("http://localhost:5000/postrental", {
                hostId,
                title,
                vehicleType,
                location,
                latitude,
                longitude,
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
                <button type="button" onClick={getLocation}>Use My Location</button>
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

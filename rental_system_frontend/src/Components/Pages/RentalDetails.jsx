import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function RentalDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    async function fetchRental() {
      try {
        const response = await axios.get(`https://rental-system-cyan.vercel.app/rentaldata/${id}`);
        setRental(response.data);
      } catch (error) {
        console.error("Error fetching rental details:", error);
      }
    }

    const user = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(!!user); 
    fetchRental();
  }, [id]);

  const handleBooking = async () => {
    if (!isLoggedIn) {
      navigate("/login"); 
      return;
    }

    if (!bookingDate) {
      alert("Please select a booking date.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
        const response = await axios.post("http://localhost:5000/book", {
            rentalId: rental._id,
            userId: user.userId,
            date: bookingDate,
        });

        alert(response.data.message); 
    } catch (error) {
        alert(error.response?.data?.message || "Booking failed."); 
    }
  };

  if (!rental) return <h2>Loading...</h2>;

  return (
    <div className="container">
      <h1>{rental.name}</h1>
      <p>Type: {rental.vehicleType}</p>
      <p>Location: {rental.location}</p>
      <p>Price: ₹{rental.price} / day</p>

      <label>Booking Date:</label>
      <input
        type="date"
        value={bookingDate}
        onChange={(e) => setBookingDate(e.target.value)}
      />
      
      <button onClick={handleBooking} className="button blue">
        Book Now
      </button>
    </div>
  );
}

export default RentalDetails;

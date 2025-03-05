import "../CSS/Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
  
    const [location, setLocation] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [vehicleType, setVehicleType] = useState("");
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      const hostId = localStorage.getItem("hostId");
      const hostVerified = localStorage.getItem("hostVerified");
  
      async function displayData() {
        try {
                //const rentaldata = await axios.get("http://localhost:5000/rentaldata");
   const rentaldata = await axios.get("https://rental-system-backend-ioto.onrender.com/rentaldata");
          setData(rentaldata.data);
  
          if (hostId) {
            const hostRentals = rentaldata.data.filter(
              (rental) => rental.hostId === hostId
            );
            setFilteredData(hostRentals);
          } else {
            setFilteredData(rentaldata.data);
          }
        } catch (error) {
          console.error("Error fetching rental details:", error);
          alert("Error fetching rental details");
        }
      }
  
      if (user && user.userId) {
        setIsLoggedIn(true);
        setIsVerified(user.isVerified || false);
      } else if (hostId) {
        setIsLoggedIn(true);
        setIsVerified(hostVerified === "true");
      }
  
      displayData();
    }, []);
  
    const applyFilters = () => {
      let filtered = data.filter((rental) => {
        return (
          (location ? rental.location.toLowerCase().includes(location.toLowerCase()) : true) &&
          (minPrice ? rental.price >= parseInt(minPrice) : true) &&
          (maxPrice ? rental.price <= parseInt(maxPrice) : true) &&
          (vehicleType ? rental.vehicleType.toLowerCase() === vehicleType.toLowerCase() : true)
        );
      });
      setFilteredData(filtered);
    };
    
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("hostId");
        localStorage.removeItem("hostVerified");
        setIsLoggedIn(false);
        setIsVerified(false);
        setFilteredData(data);
        navigate('/');
    };
    
    return (
        <div className="container">
        
        <div className="navbar">
          <h1>Rental Hub</h1>
          <div>
            {!isLoggedIn ? (
              <>
                <button onClick={() => navigate("/signup")} className="button green">Sign Up</button>
                <button onClick={() => navigate("/becomehost")} className="button blue">Become a Host</button>
              </>
            ) : localStorage.getItem("hostId") ? (
              <>
                <button onClick={() => navigate("/postrental")} className="button yellow">Post Rental</button>
                <button onClick={handleLogout} className="button red">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/becomehost")} className="button blue">Become a Host</button>
                <button onClick={handleLogout} className="button red">Logout</button>
              </>
            )}
          </div>
        </div>
  
       
       {!localStorage.getItem("hostId") && (
          <div className="filter-box">
            <h3>Filter Rentals</h3>
            <div className="filter-inputs">
              <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="filter-input" />
              <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="filter-input" />
              <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="filter-input" />
              <input type="text" placeholder="Vehicle Type" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="filter-input" />
              <button onClick={applyFilters} className="button blue">Apply Filters</button>
            </div>
          </div>
        )}
  
        
        {localStorage.getItem("hostId") && (
          <div>
            <h2 className="heading">Your Rental Listings</h2>
            <div className="rental-listings">
              {filteredData.length > 0 ? (
                filteredData.map((rental) => (
                  <div key={rental._id} className="rental-card" >
                    <h3>{rental.name}</h3>
                    <p>Type: {rental.vehicleType}</p>
                    <p>Location: {rental.location}</p>
                    <p>Price: ₹{rental.price} / day</p>
                  </div>
                ))
              ) : (
                <p className="no-rentals">You have not posted any rentals yet.</p>
              )}
            </div>
          </div>
        )}
  
        
        {!localStorage.getItem("hostId") && (
          <div>
            <h1 className="heading">Available Rentals</h1>
            <div className="rental-listings">
              {filteredData.length > 0 ? (
                filteredData.map((rental) => (
                  <div key={rental._id} className="rental-card"  onClick={() => navigate(`/rental/${rental._id}`)} style={{ cursor: "pointer" }}>
                    <h3>{rental.name}</h3>
                    <p>Type: {rental.vehicleType}</p>
                    <p>Location: {rental.location}</p>
                    <p>Price: ₹{rental.price} / day</p>
                  </div>
                ))
              ) : (
                <p className="no-rentals">No rentals available</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default Home;

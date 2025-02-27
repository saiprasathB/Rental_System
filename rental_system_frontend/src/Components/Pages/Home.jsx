import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const hostId = localStorage.getItem("hostId");
        const hostVerified = localStorage.getItem("hostVerified");

        if (user && user.userId) {
            setIsLoggedIn(true);
            setIsVerified(user.isVerified || false);
        } else if (hostId) {
            setIsLoggedIn(true);
            setIsVerified(hostVerified === "true");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("hostId");
        localStorage.removeItem("hostEmail");
        localStorage.removeItem("hostVerified");
        setIsLoggedIn(false);
        setIsVerified(false);
        navigate("/");
    };

    return (
        <div style={{ position: "relative", height: "100vh", padding: "20px" }}>
            {/* Navigation Bar */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 20px",
                backgroundColor: "#f8f9fa",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
            }}>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>Rental Hub</h1>
                <div>
                    {!isLoggedIn ? (
                        <>
                            <button onClick={() => navigate('/signup')} style={buttonStyle("#28a745")}>Sign Up</button>
                            <button onClick={() => navigate('/becomehost')} style={buttonStyle("#007bff")}>Become a Host</button>
                        </>
                    ) : isVerified ? (
                        <>
                            <button onClick={() => navigate('/postrental')} style={buttonStyle("#ffc107", "black")}>Post Rental</button>
                            <button onClick={handleLogout} style={buttonStyle("red")}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('/becomehost')} style={buttonStyle("#007bff")}>Become a Host</button>
                            <button onClick={handleLogout} style={buttonStyle("red")}>Logout</button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>Explore Rental Services</h2>
                <p>Find the best vehicle and equipment rentals near you.</p>
            </div>
        </div>
    );
}

// Button styling function
const buttonStyle = (bgColor, textColor = "white") => ({
    marginRight: "10px",
    padding: "10px 15px",
    backgroundColor: bgColor,
    color: textColor,
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
});

export default Home;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/AlreadyHost.css"; // Import the CSS file

function AlreadyAHost() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://rental-system-backend-ioto.onrender.com/alreadyahost", { email, password });

            console.log("Login Response:", res.data);
            
            if (res.data.hostId) {  
                alert(res.data.isVerified ? "Verified User!" : "Verification Pending!");

                localStorage.setItem("hostId", res.data.hostId);
                localStorage.setItem("hostVerified", res.data.isVerified ? "true" : "false"); 

                navigate("/");  
            } else {
                alert("Invalid Credentials!");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login failed! " + (error.response?.data?.message || "Server error."));
        }
    };

    return (
        <div className="container">
            <h2>Host Login</h2>
            <form onSubmit={handleLogin} className="form-container">
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="input-field"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="input-field"
                />
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
        </div>
    );
}

export default AlreadyAHost;

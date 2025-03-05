import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css"; 

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          //  const res = await axios.post("http://localhost:5000/login", 
            const res = await axios.post("https://rental-system-backend-ioto.onrender.com/login", 
                { email, password }, 
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Login Response:", res.data);

            if (res.data.userId) {
                localStorage.setItem("user", JSON.stringify({
                    userId: res.data.userId,
                    email: res.data.email,
                }));

                console.log("Navigating to Home...");
                navigate("/");
            } else {
                alert("Login failed: User not found or incorrect password.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login failed! " + (error.response?.data?.message || "Server error."));
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;

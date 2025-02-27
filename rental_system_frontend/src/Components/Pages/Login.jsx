import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://rental-system-backend-ioto.onrender.com/login", 
                { email, password }, 
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Login Response:", res.data);

            if (res.data.userId) {
                // Save user data in localStorage
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
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f4f4f4"
        }}>
            <div style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                width: "300px"
            }}>
                <h2 style={{ marginBottom: "20px", color: "#333" }}>Login</h2>
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: "10px",
                            marginBottom: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px"
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: "10px",
                            marginBottom: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px"
                        }}
                    />
                    <button type="submit" style={{
                        padding: "10px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;

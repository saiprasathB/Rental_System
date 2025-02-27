import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate(); 

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const res = await axios.post("https://rental-system-backend-ioto.onrender.com/signup", form);

            const userData = res.data;
            localStorage.setItem("hostId", userData.userId); 

            alert("Signup successful!.");
            navigate("/");
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Signup failed: " + (error.response?.data?.message || "Please try again."));
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
                <h2 style={{ marginBottom: "20px", color: "#333" }}>Signup</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Name" 
                        value={form.name}
                        onChange={handleChange} 
                        required 
                        style={{
                            padding: "10px",
                            marginBottom: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={form.email}
                        onChange={handleChange} 
                        required 
                        style={{
                            padding: "10px",
                            marginBottom: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password (min. 6 chars)" 
                        value={form.password}
                        onChange={handleChange} 
                        required 
                        style={{
                            padding: "10px",
                            marginBottom: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    />
                    <button type="submit" style={{
                        padding: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}>
                        Signup
                    </button>
                </form>
                <p style={{ marginTop: "20px" }}>
                    Already have an account?{" "}
                    <span 
                        onClick={() => navigate("/login")} 
                        style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}>
                        Login as Host
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Signup;

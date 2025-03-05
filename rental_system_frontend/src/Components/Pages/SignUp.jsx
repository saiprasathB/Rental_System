import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/SignUp.css";

function Signup() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate(); 

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          //    const res = await axios.post("http://localhost:5000/signup", form);
          const res = await axios.post("https://rental-system-backend-ioto.onrender.com/signup", form);
            const userData = res.data;
            localStorage.setItem("hostId", userData.userId); 

            alert("Signup successful!");
            navigate("/");
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Signup failed: " + (error.response?.data?.message || "Please try again."));
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Signup</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Name" 
                        value={form.name}
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={form.email}
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={form.password}
                        onChange={handleChange} 
                        required 
                    />
                    <button type="submit">Signup</button>
                </form>
                <p>
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")} className="login-link">
                        Login as Host
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Signup;

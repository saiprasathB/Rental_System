import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BecomeHost() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [documents, setDocuments] = useState(""); // Keeping it as a string
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://rental-system-backend-ioto.onrender.com/becomehost", {
                name,
                email,
                password: pass,
                Documents: documents // Ensure key matches backend
            });

            console.log("Host Request Response:", res.data);
            alert("Request Submitted for Verification!");

            navigate("/"); // Navigate back to Home after submission
        } catch (error) {
            console.error("Error submitting host request:", error);
            alert("Submission failed! Please try again.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Become a Host</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    style={{ padding: "10px", marginBottom: "10px" }}
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ padding: "10px", marginBottom: "10px" }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={pass} 
                    onChange={(e) => setPass(e.target.value)} 
                    required 
                    style={{ padding: "10px", marginBottom: "10px" }}
                />
                <input 
                    type="text" 
                    placeholder="Documents (e.g., License, ID Proof)" 
                    value={documents} 
                    onChange={(e) => setDocuments(e.target.value)} 
                    required 
                    style={{ padding: "10px", marginBottom: "10px" }}
                />
                <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Submit
                </button>
            </form>

            <p style={{ marginTop: "20px" }}>
                Already a host?{" "}
                <span 
                    onClick={() => navigate("/alreadyahost")} 
                    style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}>
                    Login as Host
                </span>
            </p>
        </div>
    );
}

export default BecomeHost;

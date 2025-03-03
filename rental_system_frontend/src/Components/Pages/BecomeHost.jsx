import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/BecomeHost.css";

function BecomeHost() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [documents, setDocuments] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://rental-system-cyan.vercel.app/becomehost", {
                name,
                email,
                password: pass,
                Documents: documents 
            });

            console.log("Host Request Response:", res.data);
            alert("Request Submitted for Verification!");

            navigate("/");
        } catch (error) {
            console.error("Error submitting host request:", error);
            alert("Submission failed! Please try again.");
        }
    };

    return (
        <div className="become-host-container">
            <h2>Become a Host</h2>
            <form onSubmit={handleSubmit} className="become-host-form">
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
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
                    value={pass} 
                    onChange={(e) => setPass(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Documents (e.g., License, ID Proof)" 
                    value={documents} 
                    onChange={(e) => setDocuments(e.target.value)} 
                    required 
                />
                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>

            <p className="already-host-text">
                Already a host? <span onClick={() => navigate("/alreadyahost")} className="login-link">Login as Host</span>
            </p>
        </div>
    );
}

export default BecomeHost;

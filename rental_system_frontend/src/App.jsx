// src/App.js
import { BrowserRouter , Route, Routes } from "react-router-dom";
import Signup from "./Components/Pages/SignUp"
import Login from "./Components/Pages/Login";
import Home from  "./Components/Pages/Home"
import BecomeHost from "./Components/Pages/BecomeHost";
import AlreadyAHost from "./Components/Pages/AlreadyHost";
import PostRental from "./Components/Pages/PostRental";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/becomehost" element={<BecomeHost/>} />
                <Route path="/alreadyahost" element={< AlreadyAHost/>} />
                <Route path="/postrental" element={< PostRental/>} />

                
                
            </Routes>
        </BrowserRouter>
    );
}

export default App;


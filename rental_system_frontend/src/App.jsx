// src/App.js
import { BrowserRouter , Route, Routes } from "react-router-dom";
import Signup from "./Components/Pages/SignUp"
import Login from "./Components/Pages/Login";
import Home from  "./Components/Pages/Home"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;


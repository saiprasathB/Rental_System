import { useEffect } from "react";

function Home() {
    useEffect(() => {
        console.log("Home component loaded!");
    }, []);

    return <h1>Welcome to Home</h1>;
}

export default Home;

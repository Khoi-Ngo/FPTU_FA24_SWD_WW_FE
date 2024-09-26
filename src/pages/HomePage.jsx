import { useNavigate } from "react-router-dom";

export const HomePage = () => {
    const navigate = useNavigate(); // Initialize navigate


    const handleRedirect = () => {
        navigate('/demo'); // Redirect to the demo page
    };

    return (
        <button onClick={handleRedirect}>Go to Demo Page</button>
    );
}
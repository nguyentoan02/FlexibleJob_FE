import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyEmail() {
    const { token } = useParams();
    const [message, setMessage] = useState(
        "Please check your email to verify your account."
    );
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isVerifying, setIsVerifying] = useState(true); // Track verification status

    useEffect(() => {
        async function verify() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`
                );
                setMessage(
                    response.data.message ||
                        "Email verified successfully! Redirecting..."
                );
                setError(null);
                setIsVerifying(false); // Verification complete

                // Redirect to login after a short delay
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } catch (err) {
                const errorMessage =
                    err.response?.data?.message ||
                    "Email verification failed. Please check your email for more information.";
                setError(errorMessage);
                setMessage(errorMessage);
                setIsVerifying(false); // Verification complete
            }
        }

        verify();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div>
                {isVerifying ? (
                    <p className="text-center text-lg">{message}</p>
                ) : error ? (
                    <p className="text-center text-lg text-red-500">{error}</p>
                ) : (
                    <p className="text-center text-lg">{message}</p>
                )}
            </div>
        </div>
    );
}

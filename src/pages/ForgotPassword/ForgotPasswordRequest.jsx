import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Toast from "@/components/Toast/Toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPasswordRequest() {
    const [email, setEmail] = useState("");
    const [toast, setToast] = useState({ message: "", type: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setToast({ message: "", type: "" }); // Reset toast
        try {
            const res = await axios.post(
                `${API_URL}/forgot-password/request-reset`,
                { email }
            );
            setToast({ message: res.data.message, type: "success" });
        } catch (error) {
            setToast({
                message:
                    error.response?.data?.message ||
                    "Failed to send reset link. Please try again.",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6"
            >
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-blue-600">
                        Forgot Your Password?
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        No worries! Enter your email and we'll send you a reset
                        link.
                    </p>
                </div>
                <div>
                    <Label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="mt-1"
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <p className="text-sm text-center text-gray-500">
                    Remember your password?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Back to Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

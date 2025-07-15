import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const API_URL = import.meta.env.VITE_API_URL;

export default function NewForgotPassword() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { token } = useParams(); // Extract token from the URL path

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${API_URL}/forgot-password/set-new-password/${token}`,
                { password }
            );
            setMessage("Password reset successful! You can now log in.");
            navigate("/login");
        } catch (error) {
            setMessage("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-6 bg-white shadow rounded space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">
                    Reset Password
                </h2>
                <div>
                    <Label>New Password</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full">
                    Reset Password
                </Button>
                {message && (
                    <p className="text-center text-sm mt-4">{message}</p>
                )}
            </form>
        </div>
    );
}

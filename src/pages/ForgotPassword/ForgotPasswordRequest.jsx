import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPasswordRequest() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${API_URL}/forgot-password/request-reset`,
                { email }
            );
            setMessage(res.data.message);
        } catch (error) {
            setMessage("Failed to send reset link. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-6 bg-white shadow rounded space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">
                    Forgot Password
                </h2>
                <div>
                    <Label>Email Address</Label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full">
                    Send Reset Link
                </Button>
                {message && (
                    <p className="text-center text-sm mt-4">{message}</p>
                )}
            </form>
        </div>
    );
}

// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const API_URL = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const token = query.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/auth/reset-password`, {
                token,
                password,
            });
            alert("Password reset successful!");
            navigate("/login");
        } catch (error) {
            alert("Failed to reset password. Try again.");
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
            </form>
        </div>
    );
}

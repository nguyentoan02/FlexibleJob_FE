// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await axios.post(`${API_URL}/auth/forgot-password`, {
                email,
            });
            return res.data;
        },
        onSuccess: () => {
            alert("Check your email for reset instructions.");
        },
        onError: () => {
            alert("Something went wrong. Please try again.");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
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
                    {mutation.isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
            </form>
        </div>
    );
}

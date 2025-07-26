import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Toast from "@/components/Toast/Toast";

export default function LoginJobseeker() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [toastMessage, setToastMessage] = useState(null); // State for toast message
    const [toastType, setToastType] = useState("success"); // State for toast type
    const { login } = useAuth();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            login(data.payload);
            const payload = JSON.parse(atob(data.payload.split(".")[1]));
            setToastMessage("Login successful!"); // Show success toast
            setToastType("success");
            setTimeout(() => {
                if (payload.role === "ADMIN") {
                    navigate("/admin/dashboard");
                } else if (payload.role === "EMPLOYER") {
                    navigate("/company/dashboard");
                } else {
                    navigate("/user/dashboard");
                }
            }, 1000); // Navigate after showing toast
        },
        onError: () => {
            setToastMessage("Login failed. Please try again."); // Show error toast
            setToastType("error");
        },
    });

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            {toastMessage && <Toast message={toastMessage} type={toastType} />}{" "}
            {/* Render Toast */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    mutation.mutate(form);
                }}
                className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6"
            >
                <h1 className="text-2xl font-bold text-center text-blue-600">
                    Welcome Back
                </h1>
                <p className="text-sm text-gray-500 text-center">
                    Please login to your account
                </p>

                <div>
                    <Label className="block text-sm font-medium text-gray-700">
                        Email
                    </Label>
                    <Input
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        placeholder="Enter your email"
                        required
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label className="block text-sm font-medium text-gray-700">
                        Password
                    </Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            placeholder="Enter your password"
                            required
                            className="mt-1 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    disabled={mutation.isLoading}
                >
                    {mutation.isLoading ? "Logging in..." : "Login"}
                </Button>
                <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-red-600 text-white hover:bg-red-700"
                >
                    Login with Google
                </Button>
                <p className="text-sm text-center text-gray-500">
                    Don't have an account?{" "}
                    <a
                        href="/register"
                        className="text-blue-600 hover:underline"
                    >
                        Register
                    </a>
                </p>
                <p className="text-sm text-center text-gray-500">
                    Forgot your password?{" "}
                    <Link
                        to="/forgot-password"
                        className="text-blue-600 hover:underline"
                    >
                        Reset it here
                    </Link>
                </p>
            </form>
        </div>
    );
}

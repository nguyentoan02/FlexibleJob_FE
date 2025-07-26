import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Toast from "@/components/Toast/Toast"; // Import Toast
import { Eye, EyeOff } from "lucide-react"; // Import icons

const API_URL = import.meta.env.VITE_API_URL;

export default function NewForgotPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Thêm state confirmPassword
    const [passwordMatchError, setPasswordMatchError] = useState(""); // Thêm state báo lỗi
    const [toast, setToast] = useState({ message: "", type: "" }); // Sử dụng toast thay vì message
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
    const navigate = useNavigate();
    const { token } = useParams(); // Extract token from the URL path
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordMatchError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        setToast({ message: "", type: "" }); // Reset toast
        try {
            await axios.post(
                `${API_URL}/forgot-password/set-new-password/${token}`,
                { password }
            );
            setToast({
                message: "Password reset successful! You can now log in.",
                type: "success",
            });
            setTimeout(() => {
                navigate("/login");
            }, 1500); // Chuyển hướng sau 1.5 giây
        } catch (error) {
            setToast({
                message:
                    error.response?.data?.message ||
                    "Failed to reset password. Please try again.",
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
                        Set New Password
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Enter your new password below.
                    </p>
                </div>
                <div>
                    <Label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        New Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordMatchError(""); // Reset lỗi khi nhập
                            }}
                            placeholder="Enter your new password"
                            required
                            className="mt-1"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
                <div>
                    <Label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Confirm Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setPasswordMatchError(""); // Reset lỗi khi nhập
                            }}
                            placeholder="Confirm your new password"
                            required
                            className="mt-1"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
                {passwordMatchError && (
                    <p className="text-red-500 text-sm">{passwordMatchError}</p>
                )}
                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
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

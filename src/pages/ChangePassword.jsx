import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import Toast from "@/components/Toast/Toast";
import { useAuth } from "@/hooks/useAuth";

export default function ChangePassword() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate form
        if (form.newPassword.length < 6) {
            setToastMessage("New password must be at least 6 characters long");
            setToastType("error");
            setIsLoading(false);
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setToastMessage("New passwords do not match");
            setToastType("error");
            setIsLoading(false);
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/change-password`,
                {
                    oldPassword: form.oldPassword,
                    newPassword: form.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setToastMessage("Password changed successfully!");
            setToastType("success");

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/profile");
            }, 2000);
        } catch (error) {
            setToastMessage(
                error.response?.data?.message || "Failed to change password"
            );
            setToastType("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            {toastMessage && <Toast message={toastMessage} type={toastType} />}

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Change Password
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your old password and choose a new one
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword">
                                Current Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="oldPassword"
                                    type={showOldPassword ? "text" : "password"}
                                    value={form.oldPassword}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            oldPassword: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your current password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowOldPassword(!showOldPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showOldPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={form.newPassword}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showNewPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={form.confirmPassword}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    placeholder="Confirm your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Changing Password..."
                                : "Change Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

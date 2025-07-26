import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import Toast from "@/components/Toast/Toast";
import axios from "axios";

const TABS = [
    { label: "Jobseeker", value: "JOBSEEKER" },
    { label: "Employer", value: "EMPLOYER" },
];

export default function SignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Thêm state này
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("JOBSEEKER");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [emailError, setEmailError] = useState("");

    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
    });

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const checkPasswordRequirements = (password) => {
        return {
            length: password.length >= 6 && password.length <= 15,
            uppercase: /[A-Z]/.test(password),
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!validateEmail(form.email)) {
            setToastMessage("Please enter a valid email address");
            setToastType("error");
            setIsLoading(false);
            return;
        }

        if (form.password !== form.confirmPassword) {
            setToastMessage("Passwords do not match");
            setToastType("error");
            setIsLoading(false);
            return;
        }

        if (form.password.length < 6 || form.password.length > 15) {
            setToastMessage("Password must be 6-15 characters long");
            setToastType("error");
            setIsLoading(false);
            return;
        }
        if (!/[A-Z]/.test(form.password)) {
            setToastMessage(
                "Password must contain at least 1 uppercase letter"
            );
            setToastType("error");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/register`,
                {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    password: form.password,
                    role: activeTab,
                }
            );

            setToastMessage(
                response.data.message ||
                    "Registration successful! Please check your email to verify your account."
            );
            setToastType("success");

            // Không chuyển hướng ngay, yêu cầu xác thực email
            setForm({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            setToastMessage(
                error.response?.data?.message || "Registration failed"
            );
            setToastType("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            {toastMessage && <Toast message={toastMessage} type={toastType} />}

            <Card className="w-full max-w-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Create an Account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to create your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex justify-center mb-4 gap-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.value}
                                type="button"
                                className={`px-4 py-2 rounded font-semibold border ${
                                    activeTab === tab.value
                                        ? "bg-green-600 text-white"
                                        : "bg-white text-green-600 border-green-600"
                                }`}
                                onClick={() => setActiveTab(tab.value)}
                                disabled={isLoading}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    value={form.firstName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            firstName: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    value={form.lastName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            lastName: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={form.email}
                                onChange={(e) => {
                                    setForm({ ...form, email: e.target.value });
                                    if (!validateEmail(e.target.value)) {
                                        setEmailError("Invalid email format");
                                    } else {
                                        setEmailError("");
                                    }
                                }}
                                required
                            />
                            {emailError && (
                                <p className="text-red-500 text-xs mt-1">
                                    {emailError}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setForm({
                                            ...form,
                                            password: value,
                                        });
                                        const req =
                                            checkPasswordRequirements(value);
                                        setPasswordRequirements(req);
                                        if (
                                            form.confirmPassword &&
                                            value !== form.confirmPassword
                                        ) {
                                            setPasswordMatchError(
                                                "Passwords do not match"
                                            );
                                        } else {
                                            setPasswordMatchError("");
                                        }
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <div className="mt-2 space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                    {passwordRequirements.length ? (
                                        <span className="text-green-600">
                                            ✔
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">✖</span>
                                    )}
                                    <span>
                                        Password must be 6-15 characters
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {passwordRequirements.uppercase ? (
                                        <span className="text-green-600">
                                            ✔
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">✖</span>
                                    )}
                                    <span>At least 1 uppercase letter</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your password"
                                    value={form.confirmPassword}
                                    onChange={(e) => {
                                        setForm({
                                            ...form,
                                            confirmPassword: e.target.value,
                                        });
                                        if (form.password !== e.target.value) {
                                            setPasswordMatchError(
                                                "Passwords do not match"
                                            );
                                        } else {
                                            setPasswordMatchError("");
                                        }
                                    }}
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
                            {passwordMatchError && (
                                <p className="text-red-500 text-xs mt-1">
                                    {passwordMatchError}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Account..." : "Sign Up"}
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-green-600 hover:underline font-medium"
                            >
                                Sign In
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

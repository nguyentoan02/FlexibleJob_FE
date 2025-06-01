import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword, verifyToken } from "../api/auth";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

function ResetPassword() {
    const { token } = useParams();

    useEffect(() => {
        verifyToken(token).then((res) => {
            console.log(res);
            setUser({ ...user, email: res.payload.userId.email });
            setMessage(res.message);
        });
    }, [token]);

    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: "",
        verifyPassword: "",
    });

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.password === user.verifyPassword) {
            try {
                setLoading(true);
                const res = await resetPassword({
                    email: user.email,
                    password: user.password,
                });
                if (res.payload) {
                    navigate("/login");
                }
                console.log(res);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
                <div>
                    <h1 className="text-2xl p-5 text-center">
                        Reset your password
                    </h1>
                    <p className="text-sm">{message}</p>
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        disabled={true}
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={user.email}
                        onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPass ? "text" : "password"}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                            value={user.password}
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                        />
                        <span
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={() => setShowPass(!showPass)}
                        >
                            {showPass ? (
                                <EyeOutlined />
                            ) : (
                                <EyeInvisibleOutlined />
                            )}
                        </span>
                    </div>
                </div>
                <div>
                    <label
                        className="block text-gray-700 mb-2"
                        htmlFor="confirm-password"
                    >
                        Confirm Password
                    </label>
                    <input
                        id="confirm-password"
                        type={showPass ? "text" : "password"}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={user.verifyPassword}
                        onChange={(e) =>
                            setUser({ ...user, verifyPassword: e.target.value })
                        }
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                    disabled={loading}
                    onClick={(e) => handleSubmit(e)}
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
}

export default ResetPassword;

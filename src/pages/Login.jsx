import { useState } from "react";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginEm() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    // const mutation = useMutation({
    //     mutationFn: loginApi(form),
    //     onSuccess: (data) => {
    //         login(data.token);
    //         const payload = JSON.parse(atob(data.token.split(".")[1]));
    //         // navigate(
    //         //     payload.role === "ADMIN"
    //         //         ? "/admin/dashboard"
    //         //         : "/user/dashboard"
    //         // );
    //         alert(payload);
    //     },
    //     onError: () => alert("Login failed"),
    // });

    const handleLogin = (e) => {
        e.preventDefault();
        loginApi(form)
            .then((res) => {
                console.log(res);
                login(res.payload);
                setMessage(res.message);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.data.message);
                setMessage(err.response.data.message);
            })
            .finally(() => {
                setLoading(false);
                setShowModal(true);
            });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        const token = localStorage.getItem("token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            navigate(
                payload.role === "ADMIN"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
            );
        }
    };

    return (
        <>
            <div className="h-screen flex bg-[url(/public/background.jpg)]">
                <div className="mx-auto space-y-4 my-auto w-1/4 p-20 bg-white/20 rounded-3xl backdrop-blur-lg isolate shadow-lg ring-1 ring-black/5">
                    <Label className="text-3xl text-center">Login</Label>
                    <Label className="text-xl">Email</Label>
                    <Input
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        required
                        className="border-white/20"
                    />
                    <Label className="text-xl">Password</Label>
                    <Input
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        required
                        className="border-white/20"
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        onClick={(e) => {
                            handleLogin(e);
                        }}
                    >
                        {loading ? "loggin in..." : "login"}
                    </Button>
                </div>
                <div></div>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex justify-center z-50 pointer-events-none bg-black/20">
                    <div
                        className="absolute top-4 transition-transform duration-500 ease-out translate-y-[-40px] opacity-0 animate-slideDown bg-white rounded-lg p-8 shadow-lg min-w-[300px] pointer-events-auto"
                        style={{
                            animation: "slideDown 0.5s forwards",
                        }}
                    >
                        <h2 className="text-xl font-bold mb-4">Message</h2>
                        <p>{message}</p>
                        <Button
                            className="mt-6 w-full"
                            onClick={() => {
                                handleCloseModal();
                            }}
                        >
                            Close
                        </Button>
                    </div>
                    <style>
                        {`
                        @keyframes slideDown {
                            from {
                                transform: translateY(-40px);
                                opacity: 0;
                            }
                            to {
                                transform: translateY(0);
                                opacity: 1;
                            }
                        }
                        `}
                    </style>
                </div>
            )}
        </>
    );
}

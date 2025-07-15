// src/pages/AuthGoogleSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode trực tiếp ở đây

export default function AuthGoogleSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); // Chỉ cần hàm login, không cần user ở đây nữa

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const error = params.get("error");

        if (token) {
            login(token); // Lưu token vào localStorage và cập nhật auth context

            try {
                const decodedToken = jwtDecode(token); // Giải mã token ngay lập tức
                const userRole = decodedToken.role; // Lấy vai trò của người dùng

                // Chuyển hướng ngay lập tức dựa trên vai trò
                if (userRole === "ADMIN") {
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    navigate("/jobs", { replace: true });
                }
            } catch (decodeError) {
                console.error("Error decoding token:", decodeError);
                alert("Failed to process login. Please try again.");
                navigate("/login", { replace: true });
            }
        } else if (error) {
            console.error("Google login failed:", error);
            alert("Google login failed. Please try again.");
            navigate("/login", { replace: true });
        } else {
            // Trường hợp không có token hay error, chuyển hướng về login
            navigate("/login", { replace: true });
        }
    }, [location, login, navigate]); // Dependencies: chỉ cần location, login, navigate

    // Xóa useEffect thứ hai vì không cần nữa

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Processing Google login...</p>
        </div>
    );
}

import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HeaderJobseeker from "../../components/Header/HeaderJobseeker";

export default function UserPage() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleProfileUpdate = () => {
        navigate("/user/profile");
    };

    return (
        <>
            <HeaderJobseeker />
            <div className="text-center mt-20">
                <h1 className="text-3xl mb-4">User Dashboard</h1>
                <p>
                    Welcome, <strong>{user?.username || "Unknown user"}</strong>
                    !
                </p>
                <p>
                    Your ID: <strong>{user?.id || "Unknown user"}</strong>
                </p>

                <Button onClick={handleProfileUpdate} className="mt-4">
                    Update Profile
                </Button>
                <Button onClick={handleLogout} className="mt-4">
                    Logout
                </Button>
            </div>
        </>
    );
}

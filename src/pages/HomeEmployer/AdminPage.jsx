import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="text-center mt-20">
            <h1 className="text-3xl mb-4">Admin Page</h1>
            <p>
                Welcome, <strong>{user?.username || "Unknown user"}</strong>!
            </p>
            <p>
                Welcome, <strong>{user?.id || "Unknown user"}</strong>!
            </p>
            <Button onClick={handleLogout} className="mt-4">
                Logout
            </Button>
        </div>
    );
}

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ role }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to="/404" replace />;
    return <Outlet />;
}

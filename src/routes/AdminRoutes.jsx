import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import AdminPage from "../pages/HomeEmployer/AdminPage";
import AdminUsers from "../pages/AdminUsers";

export default function AdminRoutes() {
    return (
        <Route element={<PrivateRoute role="ADMIN" />}>
            <Route path="/admin/dashboard" element={<AdminPage />} />
            <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
    );
}

import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import AdminPage from "../pages/HomeAdmin/AdminPage";
import AdminUsers from "../pages/AdminUsers";
import AdminProfilePage from "../pages/AdminProfile/AdminProfilePage";
import BannedAccountsPage from "../pages/BannedAccounts/BannedAccountsPage";

export default function AdminRoutes() {
    return (
        <Route element={<PrivateRoute role="ADMIN" />}>
            <Route path="/admin/dashboard" element={<AdminPage />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/admin/banned-accounts" element={<BannedAccountsPage />} />
        </Route>
    );
}

import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import AdminPage from "../pages/HomeEmployer/AdminPage";
import AdminUsers from "../pages/AdminUsers";
import AdminProfilePage from "../pages/AdminProfile/AdminProfilePage";
import { PackageManagement } from "../pages/PackageManagement";
import { CreatePackage } from "../pages/CreatePackage";
import { EditPackage } from "../pages/EditPackage";
import ChangePassword from "../pages/ChangePassword";
import Report from "../pages/Report";
import ManageJob from "../pages/ManageJob";
import ManageCompany from "../pages/ManageCompany";

export default function AdminRoutes() {
    return (
        <Route element={<PrivateRoute role="ADMIN" />}>
            <Route path="/admin/dashboard" element={<AdminPage />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/admin/packages" element={<PackageManagement />} />
            <Route path="/admin/packages/create" element={<CreatePackage />} />
            <Route
                path="/admin/packages/edit/:packageId"
                element={<EditPackage />}
            />
            <Route path="/admin/change-password" element={<ChangePassword />} />
            <Route path="/admin/report" element={<Report />} />
            <Route path="/admin/jobs" element={<ManageJob />} />
            <Route path="/admin/companies" element={<ManageCompany />} />
        </Route>
    );
}

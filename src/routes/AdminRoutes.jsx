import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import AdminPage from "../pages/Admin/AdminPage";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminProfilePage from "../pages/Admin/AdminProfilePage";
import PackageManagement from "../pages/Admin/PackageManagement";
import CreatePackage from "../pages/Admin/CreatePackage";
import EditPackage from "../pages/Admin/EditPackage";
import ChangePassword from "../pages/Admin/ChangePassword";
import Report from "../pages/Admin/Report";
import ManageJob from "../pages/Admin/ManageJob";
import ManageCompany from "../pages/Admin/ManageCompany";
import CompanyProfileDetail from "../pages/Admin/CompanyProfileDetail";
import Message from "../pages/Admin/Message";

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
            <Route path="/admin/company-profile/:companyId" element={<CompanyProfileDetail />} />
            <Route path="/admin/messages" element={<Message />} />
        </Route>
    );
}

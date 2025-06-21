import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import UserPage from "../pages/HomeJobseeker/UserPage";
import ProfilePage from "../pages/HomeJobseeker/ProfilePage"; // Import ProfilePage
import ViewCVProfile from "../pages/CVProfile/ViewCVProfile";
import CreateCVProfile from "../pages/CVProfile/CreateCVProfile";
import UpdateCVProfile from "../pages/CVProfile/UpdateCVProfile";
export default function JobseekerRoutes() {
    return (
        <Route element={<PrivateRoute role="JOBSEEKER" />}>
            <Route path="/user/dashboard" element={<UserPage />} />
            <Route path="/user/profile" element={<ProfilePage />} /> {/* NEW */}
            <Route path="/cvprofile" element={<ViewCVProfile />} />
            <Route path="/cvprofile/create" element={<CreateCVProfile />} />
            <Route path="/cvprofile/update/:id" element={<UpdateCVProfile />} />
        </Route>
    );
}

import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import UserPage from "../pages/HomeJobseeker/UserPage";
import ProfilePage from "../pages/HomeJobseeker/ProfilePage"; // Import ProfilePage

export default function JobseekerRoutes() {
    return (
        <Route element={<PrivateRoute role="JOBSEEKER" />}>
            <Route path="/user/dashboard" element={<UserPage />} />
            <Route path="/user/profile" element={<ProfilePage />} /> {/* NEW */}
        </Route>
    );
}

import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import ProfilePage from "../pages/HomeJobseeker/ProfilePage";
import ViewCVProfile from "../pages/CVProfile/ViewCVProfile";
import CreateCVProfile from "../pages/CVProfile/CreateCVProfile";
import UpdateCVProfile from "../pages/CVProfile/UpdateCVProfile";
import MyApplicationsPage from "../pages/Application/ApplicantStatistic";
import JobFavorite from "../pages/Job/JobFavourite";
import CVProfileFollowIdApply from "../pages/Application/CVProfileFollowIdApply";
import { SidebarJobseeker } from "@/pages/SideBarJSeeker/DashboardJSeeker";
import JobseekerDashboardLayout from "@/pages/SideBarJSeeker/JSeekerLayout";
import DashboardStatistic from "@/pages/SideBarJSeeker/DashboardStatistic";
import ChatPage from "../pages/Chat/ChatPage";
import NotificationPage from "../pages/Notification/NotificationPage";

export default function JobseekerRoutes() {
    return (
        <Route element={<PrivateRoute role="JOBSEEKER" />}>
            <Route
                path="/user/dashboard"
                element={<JobseekerDashboardLayout />}
            >
                <Route index element={<DashboardStatistic />} />
                <Route path="favorite-jobs" element={<JobFavorite />} />
                <Route
                    path="my-applications"
                    element={<MyApplicationsPage />}
                />
                <Route path="cvprofile" element={<ViewCVProfile />} />
                <Route path="cvprofile/create" element={<CreateCVProfile />} />
                <Route
                    path="cvprofile/update/:id"
                    element={<UpdateCVProfile />}
                />
                <Route path="chat" element={<ChatPage />} />
                <Route path="notifications" element={<NotificationPage />} />
                {/* Thêm route profile vào dashboard */}
                <Route path="profile" element={<ProfilePage />} />
            </Route>
            {/* Giữ lại route cũ để tương thích ngược */}
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route
                path="/cvprofile-follow-apply/:id"
                element={<CVProfileFollowIdApply />}
            />
        </Route>
    );
}

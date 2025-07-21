import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import CVProfileFollowID from "../pages/CVProfile/CVProfileFollowID";
import CompanyDashboard from "../pages/Employer/CompanyDashboard";
import CompanyProfilePage from "../pages/Employer/CompanyProfilePage";
import ChatPage from "../pages/Chat/ChatPage";
import NotificationPage from "../pages/Notification/NotificationPage"; // Thêm import

function CompanyRoutes() {
    return (
        <>
            <Route element={<PrivateRoute role="EMPLOYER" />}>
                <Route
                    element={<CompanyDashboard />}
                    path="/company/dashboard/*"
                />
                <Route path="/cvprofile/:id" element={<CVProfileFollowID />} />
                <Route
                    path="/createCompanyProfile"
                    element={<CompanyProfilePage />}
                />
                <Route path="/company/chat" element={<ChatPage />} />
                <Route
                    path="/company/notifications"
                    element={<NotificationPage />}
                />{" "}
                {/* Thêm route này */}
            </Route>
        </>
    );
}

export default CompanyRoutes;

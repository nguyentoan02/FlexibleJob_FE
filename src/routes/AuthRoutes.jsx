import React from "react";
import { Route } from "react-router-dom";
import LoginJobseeker from "../pages/LoginJobseeker/LoginJobseeker";
import AuthGoogleSuccess from "../pages/LoginJobseeker/AuthGoogleSuccess";
import GuestPage from "../pages/LandingPage";
import ForgotPasswordRequest from "../pages/ForgotPassword/ForgotPasswordRequest";
import NewForgotPassword from "../pages/ForgotPassword/NewForgotPassword";
import LoginEm from "../pages/Login";
import CompanyProfile from "../pages/Employer/CompanyProfile";
// import ViewCVProfile from "../pages/CVProfile/ViewCVProfile";
import JobList from "../pages/Job/JobList";
import JobDetail from "../pages/Job/JobDetail";
import SignUp from "../pages/SignUp";
import ChangePassword from "../pages/Admin/ChangePassword";
import VerifyEmail from "../pages/VerifyEmail";
import CompanyList from "../pages/CompanyPublic/CompanyList";
import CompanyDetail from "../pages/CompanyPublic/CompanyDetail";

export default function AuthRoutes() {
    return (
        <>
            <Route path="/" element={<GuestPage />} />
            <Route path="/login" element={<LoginJobseeker />} />
            <Route path="/login-em" element={<LoginEm />} />
            <Route
                path="/auth/google/success"
                element={<AuthGoogleSuccess />}
            />
            <Route
                path="/forgot-password"
                element={<ForgotPasswordRequest />}
            />
            <Route
                path="/new-forgot-password/:token"
                element={<NewForgotPassword />}
            />
            {/* Jobseeker view CompanyProfile */}
            <Route path="/company/:companyId" element={<CompanyProfile />} />
            {/* Jobseeker view CompanyProfile */}
            {/* <Route path="/cvprofile/:id" element={<ViewCVProfile />} /> */}
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:jobId" element={<JobDetail />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/company-public" element={<CompanyList />} />
            <Route
                path="/company-public/:companyId"
                element={<CompanyDetail />}
            />
        </>
    );
}

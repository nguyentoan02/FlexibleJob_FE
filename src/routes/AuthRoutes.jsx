import React from "react";
import { Route } from "react-router-dom";
import LoginJobseeker from "../pages/LoginJobseeker/LoginJobseeker";
import AuthGoogleSuccess from "../pages/LoginJobseeker/AuthGoogleSuccess";
import GuestPage from "../pages/LandingPage";
import ForgotPasswordRequest from "../pages/ForgotPassword/ForgotPasswordRequest";
import NewForgotPassword from "../pages/ForgotPassword/NewForgotPassword";
import LoginEm from "../pages/Login";

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
        </>
    );
}

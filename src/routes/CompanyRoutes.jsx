import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import CompanyProfile from "../pages/Employer/CompanyProfile";
import CompanyDashboard from "../pages/Employer/CompanyDashboard";

function CompanyRoutes() {
    return (
        <>
            <Route element={<PrivateRoute role="EMPLOYER" />}>
                <Route
                    element={<CompanyDashboard />}
                    path="/company/dashboard/*"
                />
            </Route>
        </>
    );
}

export default CompanyRoutes;

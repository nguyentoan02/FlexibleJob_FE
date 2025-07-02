import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import CompanyProfile from "../pages/Employer/CompanyProfile";
import CVProfileFollowID from "../pages/CVProfile/CVProfileFollowID";
import CompanyDashboard from "../pages/Employer/CompanyDashboard";
import CreateCompanyProfile from "../pages/Employer/CreateCompanyProfile";

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
                    element={<CreateCompanyProfile />}
                />
            </Route>
        </>
    );
}

export default CompanyRoutes;

import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import CompanyProfile from "../pages/Employer/CompanyProfile";

function CompanyRoutes() {
    return (
        <>
            <Route element={<PrivateRoute role="EMPLOYER" />}>
                <Route
                    path="/company/companyProfile"
                    element={<CompanyProfile />}
                />
            </Route>
        </>
    );
}

export default CompanyRoutes;

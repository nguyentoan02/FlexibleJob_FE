import React from "react";
import { Route, Routes } from "react-router-dom";
import SideBar from "../../components/Company/CompanyDashboard/SideBar";
import Dashboard from "../../components/Company/CompanyDashboard/Dashboard";
import HeaderJobseeker from "../../components/Header/HeaderJobseeker";
import AddNewJob from "../../components/Company/CompanyDashboard/AddNewJob";
import CompanyProfile from "../../components/Company/CompanyDashboard/CompanyProfile";

const CompanyDashboard = () => {
    return (
        <div className="h-full">
            <HeaderJobseeker />
            <div className="flex h-full">
                <SideBar />
                <div className="flex-1 p-6">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="addJob" element={<AddNewJob />} />
                        <Route path="profile" element={<CompanyProfile />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;

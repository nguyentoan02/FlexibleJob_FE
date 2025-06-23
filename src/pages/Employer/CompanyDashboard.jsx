import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import SideBar from "../../components/Company/CompanyDashboard/SideBar";
import Dashboard from "../../components/Company/CompanyDashboard/Dashboard";
import HeaderJobseeker from "../../components/Header/HeaderJobseeker";
import AddNewJob from "../../components/Company/CompanyDashboard/AddNewJob";
import CompanyProfile from "../../components/Company/CompanyDashboard/CompanyProfile";
import ManageJob from "../../components/Company/CompanyDashboard/ManageJob";
import HeaderCompany from "../../components/Header/HeaderCompany";
import { useMyCompany } from "../../hooks/myCompany";

const CompanyDashboard = () => {
    const { isCompanyApproved } = useMyCompany();
    const navigate = useNavigate();
    console.log(isCompanyApproved.data);
    if (isCompanyApproved.isLoading) return <div>loading</div>;
    if (isCompanyApproved.isError)
        return <div>{isCompanyApproved.error.message}</div>;
    if (!isCompanyApproved.data.payload.isApproved) {
        navigate("/createCompanyProfile");
    }
    return (
        <div className="h-full">
            {/* <HeaderJobseeker /> */}
            <HeaderCompany />
            <div className="flex h-full">
                <SideBar />
                <div className="flex-1 p-6">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="addJob" element={<AddNewJob />} />
                        <Route path="profile" element={<CompanyProfile />} />
                        <Route path="manageJob" element={<ManageJob />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;

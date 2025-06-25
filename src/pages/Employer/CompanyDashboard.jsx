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
import ViewPackage from "../../components/Company/CompanyDashboard/ViewPackage";

const CompanyDashboard = () => {
    const { isCompanyApproved } = useMyCompany();
    const { jobLimitation } = useMyCompany();
    const navigate = useNavigate();
    if (isCompanyApproved.isLoading || jobLimitation.isLoading)
        return <div>loading</div>;
    if (isCompanyApproved.isError || jobLimitation.isError)
        return <div>{isCompanyApproved.error.message}</div>;
    if (!isCompanyApproved.data.payload.isApproved) {
        navigate("/createCompanyProfile");
    }
    console.log(jobLimitation.data);
    return (
        <div className="h-full">
            {/* <HeaderJobseeker /> */}
            <HeaderCompany />
            <div className="flex h-full">
                <SideBar />
                <div className="flex-1 p-6">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route
                            path="addJob"
                            element={
                                <AddNewJob
                                    limitData={jobLimitation.data.payload}
                                />
                            }
                        />
                        <Route path="profile" element={<CompanyProfile />} />
                        <Route
                            path="manageJob"
                            element={
                                <ManageJob
                                    limitData={jobLimitation.data.payload}
                                />
                            }
                        />
                        <Route
                            path="viewCompanyPackage"
                            element={<ViewPackage />}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;

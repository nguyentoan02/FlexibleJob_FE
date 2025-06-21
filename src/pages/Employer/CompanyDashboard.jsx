import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SideBar from "../../components/Company/CompanyDashboard/SideBar";
import Dashboard from "../../components/Company/CompanyDashboard/Dashboard";
import HeaderJobseeker from "../../components/Header/HeaderJobseeker";
import AddNewJob from "../../components/Company/CompanyDashboard/AddNewJob";
import CompanyProfile from "../../components/Company/CompanyDashboard/CompanyProfile";
import ManageJob from "../../components/Company/CompanyDashboard/ManageJob";
import { useCompanyApproval } from "@/hooks/useCompanyApproval";
import Toast from "@/components/Toast/Toast";

const CompanyDashboard = () => {
    const { isApproved, isLoading } = useCompanyApproval();
    const [toast, setToast] = useState({ message: "", type: "" });

    useEffect(() => {
        if (!isLoading && !isApproved) {
            setToast({
                message:
                    "Your company profile needs to be approved by admin before managing jobs",
                type: "warning",
            });
        }
    }, [isApproved, isLoading]);

    return (
        <div className="h-full">
            <HeaderJobseeker />
            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}
            <div className="flex h-full">
                <SideBar isApproved={isApproved} />
                <div className="flex-1 p-6">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isApproved ? (
                                    <Dashboard />
                                ) : (
                                    <Navigate to="profile" />
                                )
                            }
                        />
                        <Route path="profile" element={<CompanyProfile />} />
                        {isApproved && (
                            <>
                                <Route path="addJob" element={<AddNewJob />} />
                                <Route
                                    path="manageJob"
                                    element={<ManageJob />}
                                />
                            </>
                        )}
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;

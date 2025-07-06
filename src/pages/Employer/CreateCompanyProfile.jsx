import React from "react";
import HeaderCompany from "../../components/Header/HeaderCompany";
import SideBar from "../../components/Company/CompanyDashboard/SideBar";
import CreateCompany from "../../components/Company/CompanyDashboard/CreateCompany";

function CreateCompanyProfile() {
    return (
        <div className="h-full">
            {/* <HeaderJobseeker /> */}
            <HeaderCompany />
            <div className="flex h-full">
                <SideBar isCreate={true} />
                <div className="flex-1 p-6">
                    <CreateCompany />
                </div>
            </div>
        </div>
    );
}

export default CreateCompanyProfile;

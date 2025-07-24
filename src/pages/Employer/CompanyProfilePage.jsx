import CompanyProfileForm from "../../components/Company/CompanyDashboard/CompanyProfileForm";
import SideBar from "../../components/Company/CompanyDashboard/SideBar";
import HeaderCompany from "../../components/Header/HeaderCompany";

function CompanyProfilePage() {
    return (
        <div className="h-full">
            {/* <HeaderJobseeker /> */}
            <HeaderCompany />
            <div className="flex h-full">
                <SideBar isCreate={true} />
                <div className="flex-1 p-6">
                    <CompanyProfileForm />
                </div>
            </div>
        </div>
    );
}

export default CompanyProfilePage;

import { Outlet } from "react-router-dom";
import { SidebarJobseeker } from "./DashboardJSeeker";

export default function JobseekerDashboardLayout() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <SidebarJobseeker />
            <div className="flex-1 p-6">
                <Outlet />
            </div>
        </div>
    );
}

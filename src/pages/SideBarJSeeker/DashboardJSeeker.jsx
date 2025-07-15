import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCVProfile } from "@/hooks/cvprofile";
import { LayoutDashboard, FileText, Heart, LogOut } from "lucide-react";

function NavItem({ icon, label, to, active = false, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center px-3 py-2 rounded-md my-1 ${
                active
                    ? "bg-green-50 text-green-500"
                    : "text-gray-700 hover:bg-gray-50"
            }`}
        >
            <div className="mr-3 text-gray-400">{icon}</div>
            <span className="flex-1">{label}</span>
        </Link>
    );
}

export function SidebarJobseeker() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { data: cvData, isLoading } = useCVProfile();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const hasCV = !!cvData?.payload?._id;

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 md:block min-h-screen">
            <div className="p-4">
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Main Navigation
                    </h3>
                    <nav className="mt-2">
                        <NavItem
                            icon={<LayoutDashboard size={20} />}
                            label="Dashboard"
                            to=""
                            active={location.pathname === "/user/dashboard"}
                        />
                        <NavItem
                            icon={<Heart size={20} />}
                            label="Favorite Jobs"
                            to="favorite-jobs"
                            active={
                                location.pathname ===
                                "/user/dashboard/favorite-jobs"
                            }
                        />
                        <NavItem
                            icon={<FileText size={20} />}
                            label="My Applications"
                            to="my-applications"
                            active={
                                location.pathname ===
                                "/user/dashboard/my-applications"
                            }
                        />
                        {/* CV logic */}
                        {!isLoading && !hasCV && (
                            <NavItem
                                icon={<FileText size={20} />}
                                label="Create CV Profile"
                                to="cvprofile/create"
                                active={
                                    location.pathname ===
                                    "/user/dashboard/cvprofile/create"
                                }
                            />
                        )}
                        {!isLoading && hasCV && (
                            <>
                                <NavItem
                                    icon={<FileText size={20} />}
                                    label="View CV Profile"
                                    to="cvprofile"
                                    active={
                                        location.pathname ===
                                        "/user/dashboard/cvprofile"
                                    }
                                />
                                <NavItem
                                    icon={<FileText size={20} />}
                                    label="Update CV Profile"
                                    to={`cvprofile/update/${cvData.payload._id}`}
                                    active={location.pathname.startsWith(
                                        "/user/dashboard/cvprofile/update"
                                    )}
                                />
                            </>
                        )}
                    </nav>
                </div>
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        My Account
                    </h3>
                    <nav className="mt-2">
                        <NavItem
                            icon={<LayoutDashboard size={20} />}
                            label="Job List"
                            to="/jobs"
                            active={location.pathname === "/jobs"}
                        />
                    </nav>
                </div>
            </div>
        </aside>
    );
}

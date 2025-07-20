import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCVProfile } from "@/hooks/cvprofile";
import {
    LayoutDashboard,
    FileText,
    Heart,
    LogOut,
    MessageCircle,
} from "lucide-react";

function NavItem({ icon, label, to, active = false, onClick }) {
    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    active
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                }`}
            >
                {icon}
                <span>{label}</span>
            </button>
        );
    }

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
            }`}
        >
            {icon}
            <span>{label}</span>
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
                        {/* Add Chat Navigation */}
                        <NavItem
                            icon={<MessageCircle size={20} />}
                            label="Messages"
                            to="chat"
                            active={
                                location.pathname === "/user/dashboard/chat"
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
                <div className="mt-auto pt-6">
                    <NavItem
                        icon={<LogOut size={20} />}
                        label="Logout"
                        onClick={handleLogout}
                    />
                </div>
            </div>
        </aside>
    );
}

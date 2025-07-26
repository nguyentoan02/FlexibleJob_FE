import React from "react";
import { Menu, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminProfile } from "@/hooks/profilepage";

export function AdminHeader({ onMenuClick }) {
    const { user } = useAuth();
    const { profileQuery } = useAdminProfile();

    return (
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between h-16 px-4">
                {/* Mobile Menu & Logo */}
                <div className="flex items-center flex-shrink-0">
                    <button
                        onClick={onMenuClick}
                        className="text-gray-500 hover:text-gray-700 md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-4"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center">
                        <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                            <span className="text-white text-lg font-bold">
                                J
                            </span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">
                            JobFlexibale
                        </span>
                    </div>
                </div>

                {/* User Welcome */}
                <div className="flex items-center space-x-4 flex-shrink-0">
                    <span className="text-gray-700 hidden md:inline">
                        Welcome, <strong>{user?.username || "Admin"}</strong>
                    </span>
                    {profileQuery.data?.phoneNumber && (
                        <div className="flex items-center space-x-2 text-gray-600 hidden lg:flex">
                            <Phone size={16} className="text-green-500" />
                            <span className="text-sm">{profileQuery.data.phoneNumber}</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

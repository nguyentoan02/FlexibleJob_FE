import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCVProfile } from "@/hooks/cvprofile";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../Notification/NotificationBell"; // Add this import
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Hamburger and close icons
import { Heart } from "lucide-react"; // Import Heart icon
import { ChevronDown, ChevronUp } from "lucide-react"; // Add these imports
export default function HeaderJobseeker() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Add state for dropdown
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { data: cvData } = useCVProfile();

    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const menuItems = [
        { label: "Home", subItems: [] },
        {
            label: "Jobs",
            to: "/jobs",
            subItems: [],
        },
        {
            label: "Recruiters",
            to: "/company-public", // Thêm đường dẫn tới Company List
            subItems: [],
        },
        {
            label: "Candidates",
            subItems: ["Candidate List", "Candidate Details"],
        },
        { label: "Pages", subItems: ["About Us", "Contact Us"] },
        {
            label: "Blog",
            subItems: ["Blog Grid", "Blog Grid 2", "Blog Single"],
        },
        { label: "Contact", subItems: [] },
    ];

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                {/* Logo */}
                <div className="text-2xl font-bold text-blue-600">JobBox</div>

                {/* Hamburger for mobile */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-700 focus:outline-none"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {menuItems.map((item, index) => (
                        <Popover key={index}>
                            <PopoverTrigger asChild>
                                {item.to ? (
                                    <Link to={item.to}>
                                        <Button
                                            variant="ghost"
                                            className="text-gray-700 hover:text-blue-600"
                                        >
                                            {item.label}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className="text-gray-700 hover:text-blue-600"
                                    >
                                        {item.label}
                                    </Button>
                                )}
                            </PopoverTrigger>
                            {item.subItems.length > 0 && (
                                <PopoverContent
                                    align="start"
                                    sideOffset={4}
                                    className="bg-white shadow-lg rounded-lg p-4 w-48"
                                >
                                    <ul className="space-y-2">
                                        {item.subItems.map(
                                            (subItem, subIndex) => (
                                                <li
                                                    key={subIndex}
                                                    className="hover:text-blue-600"
                                                >
                                                    {subItem}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </PopoverContent>
                            )}
                        </Popover>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <>
                            <NotificationBell />
                            <div className="relative">
                                <Button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                                >
                                    <span>
                                        Welcome,{" "}
                                        <strong>{user.username}</strong>
                                    </span>
                                    {isDropdownOpen ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </Button>

                                {isDropdownOpen && (
                                    <div className="fixed right-4 top-16 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            to="/user/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <div className="flex items-center">
                                                <Heart className="h-4 w-4 mr-2" />
                                                Dashboard Jobseeker
                                            </div>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login-em">
                                <Button
                                    variant="default"
                                    className="bg-blue-600 text-white"
                                >
                                    Sign in for Employer
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button
                                    variant="default"
                                    className="bg-blue-600 text-white"
                                >
                                    Sign in for Jobseeker
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Content */}
            {mobileMenuOpen && (
                <div className="md:hidden px-6 pb-4">
                    <nav className="flex flex-col space-y-4">
                        {menuItems.map((item, index) => (
                            <div key={index}>
                                {item.to ? (
                                    <Link
                                        to={item.to}
                                        className="text-gray-700 font-medium hover:text-blue-600"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <div className="text-gray-700 font-medium">
                                        {item.label}
                                    </div>
                                )}
                                {item.subItems.length > 0 && (
                                    <ul className="ml-4 mt-1 space-y-1">
                                        {item.subItems.map(
                                            (subItem, subIndex) => (
                                                <li
                                                    key={subIndex}
                                                    className="text-gray-600 hover:text-blue-600"
                                                >
                                                    {subItem}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="mt-6 flex flex-col space-y-2">
                        {user ? (
                            <>
                                <span className="text-gray-700">
                                    Welcome, <strong>{user.username}</strong>
                                </span>
                                <Button
                                    variant="default"
                                    className="bg-red-600 text-white"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login-em">
                                    <Button className="bg-blue-600 text-white w-full">
                                        Sign in for Employer
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button className="bg-blue-600 text-white w-full">
                                        Sign in for Jobseeker
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

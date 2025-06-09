import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Hamburger and close icons
export default function HeaderJobseeker() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const menuItems = [
        { label: "Home", subItems: [] },
        { label: "Find a Job", subItems: ["Job List", "Job Details"] },
        {
            label: "Recruiters",
            subItems: ["Recruiter List", "Recruiter Details"],
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
                                <Button
                                    variant="ghost"
                                    className="text-gray-700 hover:text-blue-600"
                                >
                                    {item.label}
                                </Button>
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
                                <div className="text-gray-700 font-medium">
                                    {item.label}
                                </div>
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

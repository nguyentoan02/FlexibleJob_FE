import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
export default function HeaderJobseeker() {
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

                {/* Navigation */}
                <nav className="flex items-center space-x-6">
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

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
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
                        </div>
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
        </header>
    );
}

import React, { useEffect, useRef, useState } from "react";
import {
    DashboardOutlined,
    PlusOutlined,
    FileDoneOutlined,
    UsergroupAddOutlined,
    BookOutlined,
    GiftOutlined,
    MessageOutlined,
    UserOutlined,
    LockOutlined,
    DeleteOutlined,
    PoweroffOutlined,
    MenuOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SideBarItem from "./SideBarItem";
import { useAuth } from "../../../hooks/useAuth";

const SideBar = ({ isCreate }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [action, setActions] = useState(
        `${isCreate ? "PROFILE" : "DASHBOARD"}`
    );
    const sidebarRef = useRef();
    const { logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                open &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);
    return (
        <>
            <div className="md:hidden p-4 z-50">
                <button onClick={() => setOpen(!open)} className="text-xl">
                    {open ? (
                        <div className="flex gap-5 font-semibold">
                            <CloseOutlined />
                            <div>close</div>
                        </div>
                    ) : (
                        <MenuOutlined />
                    )}
                </button>
            </div>

            <div
                ref={sidebarRef}
                className={`fixed z-40 top-0 left-0 min-h-screen w-64 bg-white shadow-md border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out 
                ${
                    open ? "translate-x-0 " : "-translate-x-full "
                } md:translate-x-0 md:static md:block mt-16 pt-16 md:mt-0 md:pt-0 `}
            >
                <h2 className="text-sm font-semibold text-gray-800 uppercase mb-4 ps-6">
                    Main Navigation
                </h2>
                <ul>
                    {!isCreate && (
                        <>
                            <SideBarItem
                                icon={<DashboardOutlined />}
                                label="Dashboard"
                                active={action === "DASHBOARD"}
                                onClick={() => {
                                    navigate("");
                                    setActions("DASHBOARD");
                                }}
                            />
                            <SideBarItem
                                icon={<PlusOutlined />}
                                label="Post New Job"
                                active={action === "ADDJOBS"}
                                onClick={() => {
                                    navigate("addJob");
                                    setActions("ADDJOBS");
                                }}
                            />
                            <SideBarItem
                                icon={<FileDoneOutlined />}
                                label="Manage Jobs"
                                active={action === "MANAGEJOBS"}
                                onClick={() => {
                                    navigate("manageJob");
                                    setActions("MANAGEJOBS");
                                }}
                            />
                            <SideBarItem
                                icon={<UsergroupAddOutlined />}
                                label="Manage Applicants"
                                active={action === "MANAGEAPPLICATION"}
                                onClick={() => {
                                    navigate("manageApplication");
                                    setActions("MANAGEAPPLICATION");
                                }}
                            />
                            <SideBarItem
                                icon={<BookOutlined />}
                                label="Bookmark Resumes"
                                badge={4}
                                onClick={() => {}}
                            />
                            <SideBarItem
                                icon={<GiftOutlined />}
                                label="Packages"
                                active={action === "PACKAGES"}
                                onClick={() => {
                                    navigate("viewCompanyPackage");
                                    setActions("PACKAGES");
                                }}
                            />
                            <SideBarItem
                                icon={<MessageOutlined />}
                                label="Messages"
                                active={action === "MESSAGES"}
                                onClick={() => {
                                    navigate("/company/chat");
                                }}
                            />
                        </>
                    )}
                </ul>

                <h2 className="ps-6 text-sm font-semibold text-gray-800 uppercase mt-6 mb-4">
                    My Accounts
                </h2>
                <ul className="space-y-2">
                    <SideBarItem
                        icon={<UserOutlined />}
                        label="My Profile"
                        onClick={() => {
                            navigate(`${isCreate ? "" : "profile"}`);
                            setActions("PROFILE");
                        }}
                        active={action === "PROFILE"}
                    />
                    <SideBarItem
                        icon={<LockOutlined />}
                        label="Change Password"
                        onClick={() => {}}
                    />
                    <SideBarItem
                        icon={<DeleteOutlined />}
                        label="Delete Account"
                        onClick={() => {}}
                    />
                    <SideBarItem
                        icon={<PoweroffOutlined />}
                        label="Log Out"
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                    />
                </ul>
            </div>
        </>
    );
};

export default SideBar;

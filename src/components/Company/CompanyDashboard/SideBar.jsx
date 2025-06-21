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

const SideBar = ({ isApproved }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [action, setActions] = useState("DASHBOARD");
    const sidebarRef = useRef();

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
                    <SideBarItem
                        icon={<UserOutlined />}
                        label="Company Profile"
                        onClick={() => {
                            navigate("profile");
                            setActions("PROFILE");
                        }}
                        active={action === "PROFILE"}
                    />

                    {isApproved && (
                        <>
                            <SideBarItem
                                icon={<DashboardOutlined />}
                                label="Dashboard"
                                onClick={() => {
                                    navigate("");
                                    setActions("DASHBOARD");
                                }}
                                active={action === "DASHBOARD"}
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
                        </>
                    )}
                </ul>
            </div>
        </>
    );
};

export default SideBar;

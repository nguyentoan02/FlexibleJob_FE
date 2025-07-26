import React from "react";

const SideBarItem = ({ icon, label, active, onClick, badge }) => {
    return (
        <li
            onClick={onClick}
            className={`flex items-center justify-between text-gray-500 border-s-8 ps-6 duration-300 hover:border-s-indigo-800 hover:bg-indigo-400/20 hover:text-indigo-500 px-2 py-2 cursor-pointer 
                ${
                    active
                        ? "border-s-indigo-800 text-indigo-500 bg-indigo-400/20"
                        : "border-s-white"
                }
            `}
        >
            <div className="flex items-center gap-2">
                {icon} {label}
            </div>
            {badge && (
                <span className="bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
        </li>
    );
};

export default SideBarItem;

import React, { useState } from "react";
import { useCompanyApplications } from "@/hooks/companyApplication";
import ApplicationTable from "./ApplicationTable";
import Pagination from "../Pagination";

const TABS = [
    { label: "All", value: "all" },
    { label: "Applied", value: "applied" },
    { label: "Hired", value: "hired" },
    { label: "Rejected", value: "rejected" },
];

const TabTable = () => {
    const [tab, setTab] = useState("all");
    const [page, setPage] = useState(1);
    const [isTabLoading, setIsTabLoading] = useState(false);
    const limit = 10;

    const { data, isLoading } = useCompanyApplications(tab, page, limit);

    // Khi đổi tab thì reset page về 1 và lazy loading 0.5s
    const handleTabChange = (value) => {
        setIsTabLoading(true);
        setTimeout(() => {
            setTab(value);
            setPage(1);
            setIsTabLoading(false);
        }, 500);
    };

    return (
        <div>
            <div className="flex space-x-4 mb-4">
                {TABS.map((t) => (
                    <button
                        key={t.value}
                        className={`px-4 py-2 rounded transition-all duration-200 font-semibold shadow-sm ${
                            tab === t.value
                                ? "bg-blue-600 text-white scale-105"
                                : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                        }`}
                        onClick={() => handleTabChange(t.value)}
                        disabled={isTabLoading}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div className="rounded-xl bg-white shadow-lg overflow-hidden border border-gray-200">
                {isTabLoading ? (
                    <div className="p-8 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                    </div>
                ) : (
                    <ApplicationTable data={data} isLoading={isLoading} />
                )}
            </div>
            <Pagination
                page={data?.currentPage || 1}
                totalPages={data?.totalPage || 1}
                setPage={setPage}
            />
        </div>
    );
};

export default TabTable;

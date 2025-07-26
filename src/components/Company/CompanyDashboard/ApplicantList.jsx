import React, { useEffect, useState } from "react";
import CVProfileFollowID from "../../../pages/CVProfile/CVProfileFollowID";
import { fetchApplicantsByJobId } from "../../../api/job";
import { useAuth } from "../../../hooks/useAuth";

const ApplicantList = ({ ApplicantList: initialList, jobId }) => {
    const [appProfile, setAppProfile] = useState({});
    const [applicants, setApplicants] = useState(initialList);
    const { token } = useAuth();

    const refetchApplicants = async () => {
        if (!jobId) return;
        const res = await fetchApplicantsByJobId(jobId, token);
        setApplicants(res.payload.applicants);
        if (appProfile._id) {
            const updated = res.payload.applicants.find(
                (a) => a._id === appProfile._id
            );
            if (updated) {
                setAppProfile(updated);
            } else {
                setAppProfile({});
            }
        }
    };
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
            {/* Applicants List Sidebar */}
            <div className="lg:col-span-1 bg-white p-6 overflow-y-auto shadow-xl rounded-2xl border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-indigo-700 tracking-tight">
                    Applicants
                </h2>
                <div className="space-y-4">
                    {applicants.map((app, index) => (
                        <button
                            key={index}
                            onClick={() => setAppProfile({ ...app })}
                            className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-4 border-2 shadow-sm hover:shadow-md hover:border-indigo-400 hover:bg-indigo-50/30
                                ${
                                    appProfile._id === app._id
                                        ? "border-indigo-500 bg-indigo-50/80"
                                        : "border-gray-100 bg-white"
                                }`}
                        >
                            <img
                                src={app.user?.imageUrl}
                                alt={`${app.user?.firstName} ${app.user?.lastName}`}
                                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 shadow"
                            />
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                    {app.user?.firstName} {app.user?.lastName}
                                </h3>
                                <div className="flex flex-col gap-1 mt-1">
                                    <span
                                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                                            app.status
                                        )}`}
                                    >
                                        {app.status}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Applied{" "}
                                        {formatDate(app.applicationDate)}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* CV Profile View */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl overflow-y-auto border border-gray-100 p-8 flex flex-col">
                {Object.keys(appProfile).length > 0 ? (
                    <CVProfileFollowID
                        key={appProfile._id}
                        profile={appProfile}
                        onStatusChange={refetchApplicants}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        <p className="text-lg">
                            Select an applicant to view their profile
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicantList;

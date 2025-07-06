<<<<<<< HEAD
import React, { useState } from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> e72cb56a91d0601950a9891f3d1e92a5f1b4c42e
import CVProfileFollowID from "../../../pages/CVProfile/CVProfileFollowID";
import { fetchApplicantsByJobId } from "../../../api/job";
import { useAuth } from "../../../hooks/useAuth";

const ApplicantList = ({ ApplicantList: initialList, jobId }) => {
    const [appProfile, setAppProfile] = useState({});
    const [applicants, setApplicants] = useState(initialList);
    const { token } = useAuth();
    console.log(applicants);

<<<<<<< HEAD
=======
    const refetchApplicants = async () => {
        if (!jobId) return;
        const res = await fetchApplicantsByJobId(jobId, token);
        setApplicants(res.payload.applicants);
        // Cập nhật lại profile nếu đang xem
        if (appProfile._id) {
            const updated = res.payload.applicants.find(
                (a) => a._id === appProfile._id
            );
            if (updated) {
                setAppProfile(updated); // Cập nhật lại profile với dữ liệu mới nhất
            } else {
                setAppProfile({}); // Nếu applicant không còn, clear profile
            }
        }
    };
>>>>>>> e72cb56a91d0601950a9891f3d1e92a5f1b4c42e
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const handleClickApplicant = (appId) => {
        setAppProfile({ ...appId });
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen bg-gray-50">
            {/* Applicants List Sidebar */}
            <div className="lg:col-span-1 bg-white p-4 overflow-y-auto shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Applicants
                </h2>
                <div className="space-y-3">
                    {applicants.map((app, index) => (
                        <button
                            key={index}
                            onClick={() => setAppProfile({ ...app })}
                            className={`w-full p-4 rounded-lg transition-all duration-200 hover:bg-gray-50 border
                                ${
                                    appProfile._id === app._id
                                        ? "border-indigo-500 bg-indigo-50/50"
                                        : "border-gray-200"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={app.user.imageUrl}
                                    alt={`${app.user.firstName} ${app.user.lastName}`}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                />
                                <div className="flex-1 text-left">
                                    <h3 className="font-medium text-gray-900">
                                        {app.user.firstName} {app.user.lastName}
                                    </h3>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                app.status
                                            )}`}
                                        >
                                            {app.status}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Applied{" "}
                                            {formatDate(app.applicationDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* CV Profile View */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-y-auto">
                {Object.keys(appProfile).length > 0 ? (
                    <CVProfileFollowID
                        key={appProfile._id}
                        profile={appProfile}
                        onStatusChange={refetchApplicants}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <p>Select an applicant to view their profile</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicantList;

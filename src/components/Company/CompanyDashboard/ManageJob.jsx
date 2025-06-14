import React, { useState } from "react";
import { useMyCompany } from "../../../hooks/myCompany";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import JobForm from "./JobForm";
import { useMutation } from "@tanstack/react-query";
import { updateJobById } from "../../../api/job";
import { useAuth } from "../../../hooks/useAuth";

const ManageJob = () => {
    const [editModal, setEditModal] = useState(false);
    const [jobData, setJobdata] = useState(null);
    const { JobsOfMyCompany } = useMyCompany();
    const { token } = useAuth();
    const formatSalary = (salary) => {
        return `${
            salary.currency
        } ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleEdit = (job) => {
        console.log(job);
        setJobdata(job);
        setEditModal(true);
    };

    const handleCloseModal = () => {
        setEditModal(false);
        setTimeout(() => {
            setJobdata(null);
        }, 200);
    };

    const jobMutaion = useMutation({
        mutationFn: (formData) => updateJobById(formData, jobData._id, token),
        onSuccess: (data) => {
            JobsOfMyCompany.refetch();
            console.log(data);
        },
        onError: (data) => {
            console.log(data);
        },
    });

    if (JobsOfMyCompany.isError)
        return <div>{JobsOfMyCompany.error.message}</div>;
    if (JobsOfMyCompany.isLoading) return <div>....loading</div>;

    const handleUpdate = (formData, e) => {
        e.preventDefault();
        console.log(formData);
        jobMutaion.mutate(formData);
    };

    if (JobsOfMyCompany.isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (JobsOfMyCompany.isError) {
        return (
            <div className="text-red-500">{JobsOfMyCompany.error.message}</div>
        );
    }

    return (
        <div className="px-4 py-6 md:px-10 md:py-10 relative min-h-screen">
            <h2 className="text-4xl font-semibold mb-4 flex items-center">
                Manage Job
            </h2>
            <div className="mb-4 text-sm text-gray-600">
                <span className="text-gray-400">Home</span> /{" "}
                <span className="text-gray-400">Dashboard</span> /{" "}
                <span className="text-indigo-600 font-semibold">
                    Manage Job
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Title</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-center">
                                Posted Date
                            </th>
                            <th className="py-3 px-4 text-center">Expired</th>
                            <th className="py-3 px-4 text-center">
                                Applications
                            </th>
                            <th className="py-3 px-4 text-center">
                                Salary Range
                            </th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {JobsOfMyCompany.data.payload.map((job) => (
                            <tr key={job._id} className="hover:bg-gray-50">
                                <td className="py-4 px-4">
                                    <div className="font-medium">
                                        {job.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {job.location} • {job.jobType}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            job.isExpired
                                                ? "bg-red-100 text-red-800"
                                                : "bg-green-100 text-green-800"
                                        }`}
                                    >
                                        {job.isExpired ? "Expired" : "Active"}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    {formatDate(job.datePosted)}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    {formatDate(job.expiredAt)}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                        Total {job.applicants.length}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    {formatSalary(job.salary)}
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex justify-center space-x-2">
                                        <button className="p-1 hover:text-blue-600 transition-colors bg-indigo-200 rounded-full px-2">
                                            <EyeOutlined />
                                        </button>
                                        <button
                                            className="p-1 hover:text-green-600 transition-colors bg-green-200 rounded-full px-2"
                                            onClick={() => handleEdit(job)}
                                        >
                                            <EditOutlined />
                                        </button>
                                        <button className="p-1 hover:text-red-600 transition-colors bg-red-200 rounded-full px-2">
                                            <DeleteOutlined />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editModal && jobData && (
                <div className="absolute inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/50 transition-opacity"></div>
                    <div className="relative min-h-screen items-center justify-start">
                        <div className="relative sm:w-[65%] md:w-[90%] lg:w-[85%] xl:w-[100%] transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                            <div className="flex items-center justify-between border-b p-4">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Update Job
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4 md:p-6">
                                <JobForm
                                    handleSubmit={handleUpdate}
                                    title="Update Job"
                                    initialData={jobData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageJob;

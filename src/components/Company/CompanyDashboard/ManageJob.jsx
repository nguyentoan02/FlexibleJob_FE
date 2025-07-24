import React, { useEffect, useState } from "react";
import JobForm from "./JobForm";
import { useMutation } from "@tanstack/react-query";
import { fetchApplicantsByJobId, updateJobById } from "../../../api/job";
import { useAuth } from "../../../hooks/useAuth";
import SearchBar from "./SearchBar";
import JobTable from "./JobTable";
import { Pagination } from "antd";
import { useMyCompanyJobs } from "../../../hooks/myCompanyJobs";
import ApplicantList from "./ApplicantList";
import { useMyCompany } from "../../../hooks/myCompany";
import LimitTationJobPost from "./LimitTationJobPost";

import { useAnalyzeApplicants } from "../../../hooks/useAnalyzeApplicants";
import AnalysisResultModal from "../../AI/AnalysisResultModal";
import { unExpireJob } from "../../../api/company";

const ManageJob = () => {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [editModal, setEditModal] = useState(false);
    const [applicantsModal, setApplicantsModal] = useState(false);
    const [jobData, setJobdata] = useState(null);
    const [applicantsData, setApplicantsData] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);

    const [isShowUnexpireModal, setIsShowUnexpireModal] = useState(false);
    const [unexpireJobId, setUnexpireJobId] = useState(null);
    const [newExpireDate, setNewExpireDate] = useState("");
    const [isUnexpiring, setIsUnexpiring] = useState(false);

    // AI Analysis State
    const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [analyzeJobId, setAnalyzeJobId] = useState(null);
    const [analyzeEnabled, setAnalyzeEnabled] = useState(false);
    const {
        data: analysisResult,
        error: analysisError,
        isFetching: isAnalyzing,
        refetch: refetchAnalysis,
    } = useAnalyzeApplicants(analyzeJobId, analyzeEnabled);
    const limit = 5;
    const { token } = useAuth();
    const { JobsOfMyCompany } = useMyCompanyJobs(page, 5, search);
    const { jobLimitation } = useMyCompany();

    const jobMutaion = useMutation({
        mutationFn: (formData) => updateJobById(formData, jobData._id, token),
        onSuccess: () => JobsOfMyCompany.refetch(),
    });

    useEffect(() => {
        JobsOfMyCompany.refetch();
        jobLimitation.refetch();
    }, []);
    useEffect(() => {
        if (analysisResult) {
            setAnalysisModalOpen(true);
        }
    }, [analysisResult]);

    const handleEdit = (job) => {
        setJobdata({
            ...job,
            category:
                typeof job.category === "object"
                    ? job.category._id
                    : job.category,
        });
        setEditModal(true);
    };

    const handleUpdate = (formData, e) => {
        e.preventDefault();
        // Nếu category là array object, lấy _id
        let category = formData.category;
        if (
            Array.isArray(category) &&
            category.length > 0 &&
            typeof category[0] === "object"
        ) {
            category = category.map((c) => c._id);
            // Nếu chỉ cho phép 1 category, lấy category[0]
            category = category[0];
        }
        const submitData = { ...formData, category };
        jobMutaion.mutate(submitData);
        setEditModal(false);
    };

    if (JobsOfMyCompany.isLoading || jobLimitation.isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900"></div>
            </div>
        );
    }

    if (JobsOfMyCompany.isError || jobLimitation.isError) {
        return <div className="text-red-500">{error.message}</div>;
    }
    const jobs = JobsOfMyCompany.data.payload.jobs;
    const totalPages = Math.ceil(JobsOfMyCompany.data.payload.total / limit);

    const handleViewApplicants = (jobId) => {
        setSelectedJobId(jobId); // Lưu lại jobId đang xem
        fetchApplicantsByJobId(jobId, token)
            .then((res) => {
                setApplicantsData(res.payload.applicants);
                setApplicantsModal(true);
            })
            .catch((err) => console.log(err));
    };

    const handleAnalyzeClick = () => {
        if (!selectedJobId) return;
        setAnalyzeJobId(selectedJobId);
        setAnalyzeEnabled(true);
        refetchAnalysis();
    };

    const handleShowUnexpireModal = (jobId) => {
        setUnexpireJobId(jobId);
        setIsShowUnexpireModal(true);
        setNewExpireDate("");
    };

    const handleUnexpireJob = async () => {
        setIsShowUnexpireModal(true);
        if (!newExpireDate) return;
        setIsUnexpiring(true);
        try {
            await unExpireJob(token, newExpireDate, unexpireJobId);
            setIsShowUnexpireModal(false);
            setNewExpireDate("");
            JobsOfMyCompany.refetch();
        } catch (err) {
            alert("Failed to unexpire job!");
        }
        setIsUnexpiring(false);
    };

    return (
        <div className="px-4 py-6 md:px-10 md:py-10 relative min-h-screen">
            <div className="flex justify-between mb-2">
                <div className="w-[80%]">
                    <h2 className="text-4xl font-semibold mb-4">Manage Job</h2>
                    <SearchBar
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        onSearch={() => {
                            setPage(1);
                            setSearch(searchInput);
                        }}
                    />
                </div>
                <div>
                    <LimitTationJobPost data={jobLimitation.data.payload} />
                </div>
            </div>
            <JobTable
                onViewApplicants={handleViewApplicants}
                jobs={jobs}
                isFetching={JobsOfMyCompany.isFetching}
                onEdit={handleEdit}
                onExpire={handleShowUnexpireModal}
            />

            <div className="w-full flex justify-center">
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                />
            </div>

            {editModal && jobData && (
                <div className="absolute inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/50 transition-opacity"></div>
                    <div className="relative min-h-screen items-center justify-start">
                        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                            <div className="flex items-center justify-between border-b p-4">
                                <h3 className="text-xl font-semibold">
                                    Update Job
                                </h3>
                                <button
                                    onClick={() => setEditModal(false)}
                                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                >
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
                            <div className="p-4 md:p-6">
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
            {applicantsModal && (
                <div className="absolute inset-0 z-50">
                    <div
                        className="fixed inset-0 bg-black/50 transition-opacity"
                        onClick={() => setApplicantsModal(false)}
                    ></div>
                    <div className="relative min-h-screen items-center justify-start p-5 bg-white rounded-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold">Applicants</h3>
                            <button
                                onClick={handleAnalyzeClick}
                                disabled={isAnalyzing}
                                className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>🤖 Analyze & Rank with AI</>
                                )}
                            </button>
                        </div>
                        <ApplicantList
                            ApplicantList={applicantsData}
                            jobId={jobData?._id}
                        />
                    </div>
                </div>
            )}

            <AnalysisResultModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setAnalysisModalOpen(false)}
                data={analysisResult}
                error={analysisError}
                isLoading={isAnalyzing}
            />
            {isShowUnexpireModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
                            onClick={() => setIsShowUnexpireModal(false)}
                        >
                            ×
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-indigo-700">
                            Unexpire Job
                        </h3>
                        <label className="block mb-2 font-medium">
                            New Expire Date
                        </label>
                        <input
                            type="date"
                            className="border rounded p-2 w-full mb-4"
                            value={newExpireDate}
                            onChange={(e) => setNewExpireDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                        />
                        <button
                            className="w-full py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                            onClick={handleUnexpireJob}
                            disabled={!newExpireDate || isUnexpiring}
                        >
                            {isUnexpiring ? "Updating..." : "Confirm Unexpire"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageJob;

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

const ManageJob = () => {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [editModal, setEditModal] = useState(false);
    const [applicantsModal, setApplicantsModal] = useState(false);
    const [jobData, setJobdata] = useState(null);
    const [applicantsData, setApplicantsData] = useState([]);
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

    const handleEdit = (job) => {
        console.log("jobdata", job);
        setJobdata(job);
        setEditModal(true);
    };

    const handleUpdate = (formData, e) => {
        e.preventDefault();
        console.log(formData);
        jobMutaion.mutate(formData);
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
        // const response = await fetchApplicantsByJobId(jobId, token);
        // console.log(response.payla);
        fetchApplicantsByJobId(jobId, token)
            .then((res) => {
                setApplicantsData(res.payload.applicants);
                console.log("applicantsData", res.payload.applicants);
                setApplicantsModal(true);
            })
            .catch((err) => console.log(err));
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
                        <ApplicantList
                            ApplicantList={applicantsData}
                            jobId={jobData?._id}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageJob;

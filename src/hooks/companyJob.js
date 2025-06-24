import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchApplicantsByJobId, getJobByJobId } from "../api/job";

export const useCompanyJobId = (jobId) => {
    const token = localStorage.getItem("token");
    const JobData = useQuery({
        queryKey: ["SingleJob"],
        queryFn: () => getJobByJobId(jobId),
    });

    const JobApplicants = useQuery({
        queryKey: ["JobApplicants"],
        queryFn: () => fetchApplicantsByJobId(jobId, token),
    });
    return { JobData, JobApplicants };
};

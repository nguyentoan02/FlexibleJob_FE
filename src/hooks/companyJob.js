import { useMutation, useQuery } from "@tanstack/react-query";
import { getJobByJobId } from "../api/job";

export const useCompanyJobId = (jobId) => {
    const token = localStorage.getItem("token");
    const JobData = useQuery({
        queryKey: ["SingleJob"],
        queryFn: () => getJobByJobId(jobId),
    });
    return { JobData };
};

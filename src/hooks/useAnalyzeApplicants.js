import { useQuery } from "@tanstack/react-query";
import { analyzeJobApplicants } from "../api/job";

export const useAnalyzeApplicants = (jobId, enabled) => {
    const token = localStorage.getItem("token");

    return useQuery({
        queryKey: ["analyze-applicants", jobId],
        queryFn: () => {
            if (!token) throw new Error("No token found!");
            if (!jobId) throw new Error("No jobId provided!");
            return analyzeJobApplicants(jobId, token);
        },
        enabled: enabled && !!jobId, // chỉ chạy khi enabled=true và có jobId
        refetchOnWindowFocus: false,
        retry: false,
    });
};

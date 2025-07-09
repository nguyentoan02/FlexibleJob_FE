import { useMutation } from "@tanstack/react-query";
import { analyzeJobApplicants } from "../api/job"; // Đảm bảo đường dẫn này đúng

export const useAnalyzeApplicants = () => {
    const token = localStorage.getItem("token");

    return useMutation({
        mutationFn: (jobId) => {
            if (!token) throw new Error("No token found!");
            return analyzeJobApplicants(jobId, token);
        },
    });
};

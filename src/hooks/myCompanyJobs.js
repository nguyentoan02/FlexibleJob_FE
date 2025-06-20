import { useQuery } from "@tanstack/react-query";
import { getJobsByUserId } from "../api/job";
import { useAuth } from "./useAuth";

export const useMyCompanyJobs = (page = 1, limit = 5, search = "") => {
    const { token } = useAuth();
    const JobsOfMyCompany = useQuery({
        queryKey: ["JobsOfMyCompany", page, search],
        queryFn: () => getJobsByUserId(token, page, limit, search),
        keepPreviousData: true,
        staleTime: 1000 * 60,
    });
    return { JobsOfMyCompany };
};

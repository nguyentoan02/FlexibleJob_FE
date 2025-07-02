import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useJobList = (page = 1, limit = 2) => {
    return useQuery({
        queryKey: ["jobList", page, limit],
        queryFn: async () => {
            const response = await axios.get(
                `${
                    import.meta.env.VITE_API_URL
                }/jobs?page=${page}&limit=${limit}`
            );
            return response.data;
        },
        keepPreviousData: true,
    });
};

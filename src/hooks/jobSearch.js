// src/hooks/jobSearch.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useJobSearch = (searchParams) => {
    return useQuery({
        queryKey: ["jobs", searchParams], // Query key changes when searchParams change
        queryFn: async () => {
            // Tạo một bản sao của searchParams để xử lý
            const apiParams = { ...searchParams };

            // Chuyển đổi 'all' thành chuỗi rỗng để backend bỏ qua filter
            if (apiParams.level === "all") {
                apiParams.level = "";
            }
            if (apiParams.jobType === "all") {
                apiParams.jobType = "";
            }

            const params = new URLSearchParams({
                ...apiParams,
                page: searchParams.page.toString(),
                limit: searchParams.limit.toString(), // Sử dụng limit từ searchParams
            });

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/search-jobs?${params}`
            );
            return response.data;
        },
        keepPreviousData: true, // Giữ lại dữ liệu cũ trong khi tải dữ liệu mới để UI mượt hơn
    });
};

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
    fetchCompanyJobs,
    fetchCompanyProfile,
    CompanyStats,
} from "../api/company";

export const useCompany = (companyId) => {
    const CompanyProfile = useQuery({
        queryKey: ["CompanyProfile"],
        queryFn: () => fetchCompanyProfile(companyId),
    });

    const CompanyJos = useQuery({
        queryKey: ["CompanyJobs"],
        queryFn: () => fetchCompanyJobs(companyId),
    });

    return { CompanyProfile, CompanyJos };
};

export const useCompanyStats = (metric, range) => {
    const token = localStorage.getItem("token");

    return useQuery({
        queryKey: ["companyStats", metric, range], // Query key động để cache riêng cho từng loại metric và range
        queryFn: () => CompanyStats(token, metric, range),
        enabled: !!token, // Chỉ chạy query khi có token
        select: (data) => data.payload, // Chỉ trả về phần payload
    });
};

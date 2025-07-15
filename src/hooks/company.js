import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { fetchCompanyJobs, fetchCompanyProfile } from "../api/company";

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

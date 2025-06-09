import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { fetchCompanyProfile } from "../api/company";

export const useCompany = (companyId) => {
    const CompanyProfile = useQuery({
        queryKey: ["CompanyProfile"],
        queryFn: () => fetchCompanyProfile(companyId),
    });
    return { CompanyProfile };
};

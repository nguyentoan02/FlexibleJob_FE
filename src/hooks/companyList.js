import { useQuery } from "@tanstack/react-query";
import { fetchAllCompany } from "../api/company";

export const useCompanyList = () => {
    const companyList = useQuery({
        queryKey: ["CompanyList"],
        queryFn: () => fetchAllCompany(),
    });

    return { companyList };
};

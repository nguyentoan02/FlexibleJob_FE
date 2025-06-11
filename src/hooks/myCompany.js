import { useQuery } from "@tanstack/react-query";
import { fetchMyCompanyProfile } from "../api/company";

export const useMyCompany = () => {
    const token = localStorage.getItem("token");
    const MyCompanyProfile = useQuery({
        queryKey: ["MyCompany"],
        queryFn: () => fetchMyCompanyProfile(token),
    });
    return { MyCompanyProfile };
};

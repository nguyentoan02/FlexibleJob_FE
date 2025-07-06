import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import {
    fetchAllApplications,
    fetchAllAppliedApplications,
    fetchAllAcceptedApplications,
    fetchAllRejectApplications,
} from "../api/companyApplication";

const keyMap = {
    all: "applications",
    applied: "appliedApplications",
    hired: "acceptedApplications",
    rejected: "rejectedApplications",
};

export const useCompanyApplications = (type, page, limit) => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["companyApplications", type, page, limit],
        queryFn: async () => {
            let res;
            switch (type) {
                case "applied":
                    res = await fetchAllAppliedApplications(token, page, limit);
                    break;
                case "hired":
                    res = await fetchAllAcceptedApplications(
                        token,
                        page,
                        limit
                    );
                    break;
                case "rejected":
                    res = await fetchAllRejectApplications(token, page, limit);
                    break;
                default:
                    res = await fetchAllApplications(token, page, limit);
            }
            // Trả về đúng key và phân trang
            return {
                list: res.payload[keyMap[type] || "applications"] || [],
                totalPage: res.payload.totalPage || 1,
                currentPage: res.payload.currentPage || 1,
            };
        },
        keepPreviousData: true,
        enabled: !!token,
    });
};

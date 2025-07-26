import { useQuery } from "@tanstack/react-query";
import { fetchCVProfileDetail } from "@/api/cvprofile";
import { useAuth } from "./useAuth";

export const useCVProfile = () => {
    // Không cần nhận cvProfileId nữa
    const { token, user } = useAuth(); // Lấy thêm user từ useAuth

    const cvProfileQuery = useQuery({
        queryKey: ["cvProfile", user?.id], // Sử dụng user.id từ token
        queryFn: () => fetchCVProfileDetail(user?.id, token),
        enabled: !!token && !!user?.id,
        retry: 1,
        staleTime: 5 * 60 * 1000,
        onError: (error) => {
            console.error("Error fetching CV Profile:", error);
        },
    });

    return cvProfileQuery;
};

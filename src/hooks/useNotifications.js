import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getUserNotifications, markAllAsRead } from "../api/notification";

export const useNotifications = (page = 1, limit = 10) => {
    const { token } = useAuth();
    return useQuery({
        queryKey: ["notifications", page, limit],
        queryFn: () => getUserNotifications(token, page, limit),
        enabled: !!token,
        staleTime: 1000 * 60 * 2, // 2 minutes
        refetchInterval: 1000 * 60, // Refetch every 1 minute
    });
};

export const useMarkAllAsRead = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => markAllAsRead(token),
        onSuccess: () => {
            // Invalidate and refetch all notification queries
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import {
    getUserChats,
    getChatMessages,
    markMessagesAsRead,
    createChatWithCompany,
    searchEmployers,
    getAllEmployers,
    sendMessage,
} from "../api/chat";

export const useUserChats = (page = 1, limit = 20) => {
    const { token } = useAuth();
    return useQuery({
        queryKey: ["userChats", page, limit],
        queryFn: () => getUserChats(token, page, limit),
        enabled: !!token,
        refetchInterval: false, // TẮT POLLING
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
};

export const useChatMessages = (chatId, page = 1, limit = 50) => {
    const { token } = useAuth();
    return useQuery({
        queryKey: ["chatMessages", chatId, page, limit],
        queryFn: () => getChatMessages(chatId, token, page, limit),
        enabled: !!token && !!chatId,
        refetchInterval: false, // TẮT POLLING
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: false,
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
    });
};

export const useMarkAsRead = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (chatId) => markMessagesAsRead(chatId, token),
        onSuccess: (data, variables) => {
            // ✅ Chỉ update cache locally
            queryClient.setQueryData(["userChats"], (oldData) => {
                if (!oldData?.payload) return oldData;

                return {
                    ...oldData,
                    payload: oldData.payload.map((chat) =>
                        chat._id === variables
                            ? { ...chat, unreadCount: 0 }
                            : chat
                    ),
                };
            });
        },
        onError: (error) => {
            console.error("Failed to mark as read:", error);
        },
    });
};

export const useSendMessage = () => {
    const { token, user } = useAuth();
    // Không cần queryClient ở đây
    return useMutation({
        mutationFn: ({ chatId, content, messageType }) =>
            sendMessage(chatId, content, token, messageType),
        // Không cần onSuccess, onSettled, onMutate liên quan đến refetch/invalidate
    });
};

export const useCreateChatWithCompany = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (companyId) => createChatWithCompany(companyId, token),
        onSuccess: () => {
            queryClient.invalidateQueries(["userChats"]);
        },
    });
};

// ✅ CHỈ dùng khi search
export const useSearchEmployers = (searchTerm, enabled = false) => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["searchEmployers", searchTerm],
        queryFn: () => searchEmployers(searchTerm, token),
        enabled: !!token && !!searchTerm && searchTerm.length > 0 && enabled,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
};

// ✅ CHỈ dùng khi mở modal
export const useGetAllEmployers = (enabled = false) => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["allEmployers"],
        queryFn: () => getAllEmployers(token),
        enabled: !!token && enabled,
        staleTime: 10 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
    });
};

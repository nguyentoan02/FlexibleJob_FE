import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "./useAuth";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetches the applications submitted by the currently logged-in user.
 * @param {string} token - The JWT token for authorization.
 * @returns {Promise<object>} The API response data.
 */
const getMyApplications = async (token) => {
    const response = await axios.get(
        `${API_URL}/applications/my-applications`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const useMyApplications = () => {
    const { token } = useAuth();
    return useQuery({
        queryKey: ["myApplications", token],
        queryFn: () => getMyApplications(token),
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

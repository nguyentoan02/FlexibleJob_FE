// src/hooks/favoriteJob.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useFavoriteJobs = () => {
    const queryClient = useQueryClient();

    // Get favorite jobs
    const favoritesQuery = useQuery({
        queryKey: ["favoriteJobs"],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/favorite-jobs`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return response.data;
        },
    });

    // Check if job is favorited
    const checkFavoriteStatus = async (jobId) => {
        const response = await axios.get(
            `${API_URL}/favorite-jobs/${jobId}/status`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data.payload.isFavorited;
    };

    // Add to favorites mutation
    const addToFavorites = useMutation({
        mutationFn: async (jobId) => {
            const response = await axios.post(
                `${API_URL}/favorite-jobs/${jobId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["favoriteJobs"]);
        },
    });

    // Remove from favorites mutation
    const removeFromFavorites = useMutation({
        mutationFn: async (jobId) => {
            const response = await axios.delete(
                `${API_URL}/favorite-jobs/${jobId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["favoriteJobs"]);
        },
    });

    return {
        favoritesQuery,
        checkFavoriteStatus,
        addToFavorites,
        removeFromFavorites,
    };
};

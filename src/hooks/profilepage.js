import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchProfile, updateProfile, fetchAdminProfile, updateAdminProfile } from "@/api/profilepage";
import { useAuth } from "@/hooks/useAuth";

/**
 * Custom hook for managing profile-related logic.
 */
export const useProfile = () => {
    const { token } = useAuth();

    // Fetch profile data
    const profileQuery = useQuery({
        queryKey: ["profile"],
        queryFn: () => fetchProfile(token),
        enabled: !!token,
    });

    // Update profile data
    const profileMutation = useMutation({
        mutationFn: (profileData) => updateProfile(token, profileData),
    });

    return { profileQuery, profileMutation };
};

/**
 * Custom hook for managing admin profile-related logic.
 */
export const useAdminProfile = () => {
    const { token } = useAuth();

    // Fetch admin profile data
    const profileQuery = useQuery({
        queryKey: ["adminProfile"],
        queryFn: () => fetchAdminProfile(token),
        enabled: !!token,
    });

    // Update admin profile data
    const profileMutation = useMutation({
        mutationFn: (profileData) => updateAdminProfile(token, profileData),
    });

    return { profileQuery, profileMutation };
};

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchCVProfileDetail = async (userId, token) => {
    try {
        // Thay đổi đường dẫn API để lấy CV Profile của user cụ thể
        const res = await axios.get(`${API_URL}/cv-profiles`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        if (error.response) {
            throw new Error(
                error.response.data.message || "Failed to fetch CV Profile"
            );
        }
        throw new Error("Network error while fetching CV Profile");
    }
};

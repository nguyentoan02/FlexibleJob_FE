import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Lấy danh sách thông báo của người dùng.
 * @param {string} token - JWT token.
 * @param {number} page - Số trang.
 * @param {number} limit - Số lượng mỗi trang.
 * @returns {Promise<object>}
 */
export const getUserNotifications = async (token, page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
    });
    return response.data;
};

/**
 * Đánh dấu tất cả thông báo là đã đọc.
 * @param {string} token - JWT token.
 * @returns {Promise<object>}
 */
export const markAllAsRead = async (token) => {
    const response = await axios.patch(
        `${API_URL}/notifications/read-all`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

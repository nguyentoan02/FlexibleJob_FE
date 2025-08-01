import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch the profile of the currently logged-in user.
 * @param {string} token - Authorization token.
 * @returns {Promise<Object>} - Profile data.
 */
export const fetchProfile = async (token) => {
    const res = await axios.get(`${API_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.payload;
};

/**
 * Fetch the profile of the currently logged-in admin.
 * @param {string} token - Authorization token.
 * @returns {Promise<Object>} - Admin profile data.
 */
export const fetchAdminProfile = async (token) => {
    const res = await axios.get(`${API_URL}/admin/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.payload;
};

/**
 * Update the profile of the currently logged-in user.
 * @param {string} token - Authorization token.
 * @param {FormData} profileData - Profile data to update.
 * @returns {Promise<Object>} - Updated profile data.
 */
export const updateProfile = async (token, profileData) => {
    const res = await axios.put(`${API_URL}/profile/me`, profileData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.payload;
};

/**
 * Update the profile of the currently logged-in admin.
 * @param {string} token - Authorization token.
 * @param {FormData} profileData - Admin profile data to update.
 * @returns {Promise<Object>} - Updated admin profile data.
 */
export const updateAdminProfile = async (token, profileData) => {
    const res = await axios.put(`${API_URL}/admin/profile/me`, profileData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.payload;
};

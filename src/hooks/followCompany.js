import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const followCompany = async (companyId, token) => {
    const res = await axios.post(
        `${API_URL}/follow-company/${companyId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};

export const unfollowCompany = async (companyId, token) => {
    const res = await axios.delete(`${API_URL}/follow-company/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

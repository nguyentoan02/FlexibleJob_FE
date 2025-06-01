import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const login = async ({ email, password }) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return res.data;
};

export const verifyToken = async (token) => {
    const res = await axios.get(`${API_URL}/auth/verifyToken/${token}`);
    return res.data;
};

export const resetPassword = async ({ email, password }) => {
    const res = await axios.post(`${API_URL}/auth/updatePassword`, {
        email,
        password,
    });
    return res.data;
};

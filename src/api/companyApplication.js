import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchAllApplications = async (token, page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL}/companyApplication`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
    });
    return response.data;
};
export const fetchAllAppliedApplications = async (
    token,
    page = 1,
    limit = 10
) => {
    const response = await axios.get(`${API_URL}/companyApplication/applied`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
    });
    return response.data;
};
export const fetchAllAcceptedApplications = async (
    token,
    page = 1,
    limit = 10
) => {
    const response = await axios.get(`${API_URL}/companyApplication/hired`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
    });
    return response.data;
};
export const fetchAllRejectApplications = async (
    token,
    page = 1,
    limit = 10
) => {
    const response = await axios.get(`${API_URL}/companyApplication/rejected`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
    });
    return response.data;
};

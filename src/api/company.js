import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const fetchCompanyProfile = async (companyId) => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const res = await axios.get(`${API_URL}/company/${companyId}`);
            resolve(res.data);
        }, 2000); // 2 seconds delay
    });
};

export const fetchCompanyJobs = async (companyId) => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const res = await axios.get(`${API_URL}/jobs/company/${companyId}`);
            resolve(res.data);
        }, 2000);
    });
};

export const fetchMyCompanyProfile = async (token) => {
    const res = await axios.get(`${API_URL}/company/myCompany`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const updateCompanyProfile = async (formData, token) => {
    const response = await axios.put(`${API_URL}/company`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getCompanyApproval = async (token) => {
    const response = await axios.get(`${API_URL}/company/isCompanyApproved`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const createCompanyProfile = async (token, body) => {
    const response = await axios.get(`${API_URL}/company`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

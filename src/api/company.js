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

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
        },
    });
    return response.data;
};

export const getPendingCompanies = async (token) => {
    const response = await axios.get(
        `${API_URL}/company/admin/pending-approvals`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const updateCompanyApproval = async ({
    companyId,
    isApproved,
    token,
}) => {
    const response = await axios.patch(
        `${API_URL}/company/admin/approve/${companyId}`,
        { isApproved },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const getAllPackage = async () => {
    const response = await axios.get(`${API_URL}/packages`);
    return response.data;
};

export const getJobStats = async (token) => {
    const response = await axios.get(`${API_URL}/company/stats/job`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getInVoices = async (token) => {
    const response = await axios.get(`${API_URL}/company/stats/invoices`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const CompanyStats = async (token, metric, range) => {
    const response = await axios.get(`${API_URL}/company/stats/timeseries`, {
        params: {
            metric,
            range,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const unExpireJob = async (token, expireDate, jobId) => {
    const response = await axios.put(
        `${API_URL}/manageJobs/expireJob/${jobId}`,
        { expireDate },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

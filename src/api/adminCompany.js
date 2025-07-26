import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// Get company approval statistics
export const fetchCompanyApprovalStats = async (token) => {
    const response = await axios.get(`${API_URL}/company/admin/stats`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get all companies with optional filters
export const fetchCompanyList = async (token, filters = {}) => {
    const response = await axios.get(`${API_URL}/company/admin/list`, {
        params: filters,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Update company approval status
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

// Delete company
export const deleteCompany = async (companyId, token) => {
    const response = await axios.delete(`${API_URL}/company/admin/${companyId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get company details for admin
export const fetchCompanyDetails = async (companyId, token) => {
    const response = await axios.get(`${API_URL}/company/admin/${companyId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get pending companies for approval
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
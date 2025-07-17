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

export async function fetchCompanyApprovalStats(token) {
  const API_URL = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${API_URL}/company/admin/company-approval-stats`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.payload;
}

export const fetchCompanyList = async (token, { location = [], industry = [], companySize = [] } = {}) => {
  const API_URL = import.meta.env.VITE_API_URL || '';
  let url = `${API_URL}/company/admin/filter-companies`;
  const params = [];
  if (location && location.length > 0) {
    params.push(`location=${location.map(encodeURIComponent).join(',')}`);
  }
  if (industry && industry.length > 0) {
    params.push(`industry=${industry.map(encodeURIComponent).join(',')}`);
  }
  if (companySize && companySize.length > 0) {
    params.push(`companySize=${companySize.map(encodeURIComponent).join(',')}`);
  }
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.payload;
};

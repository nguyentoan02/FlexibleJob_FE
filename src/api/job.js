import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createNewJob = async (formdata, token) => {
    console.log("token khi goi api", token);
    const response = await axios.post(
        `${API_URL}/manageJobs/createJob`,
        {
            ...formdata,
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getJobsByUserId = async (
    token,
    page = 1,
    limit = 10,
    search = ""
) => {
    const response = await axios.get(
        `${API_URL}/manageJobs/getJobs/ByCompany`,
        {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, limit, search },
        }
    );
    return response.data;
};

export const getJobByJobId = async (jId) => {
    const response = await axios.get(`${API_URL}/manageJobs/getJob/${jId}`);
    return response.data;
};

export const updateJobById = async (updateData, jId, token) => {
    console.log(updateData);
    console.log(jId);
    const response = await axios.put(
        `${API_URL}/manageJobs/${jId}`,
        { ...updateData },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

export const fetchApplicantsByJobId = async (jId, token) => {
    const response = await axios.get(`${API_URL}/manageJobs/${jId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const changeApplicationStatus = async (appId, token, action, note) => {
    const response = await axios.patch(
        `${API_URL}/applications/changeStatus/${appId}`,
        { note },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { action: action },
        }
    );
    return response.data;
};

export const getJobLimitation = async (token) => {
    const response = await axios.get(`${API_URL}/manageJobs/limit`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

/**
 * Gửi yêu cầu phân tích các ứng viên của một job bằng AI.
 * @param {string} jobId - ID của công việc.
 * @param {string} token - JWT token để xác thực.
 * @returns {Promise<object>} - Payload chứa kết quả phân tích từ AI.
 */
export const analyzeJobApplicants = async (jobId, token) => {
    const response = await axios.get(
        `${API_URL}/applications/analyze/${jobId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data.payload; // Trả về payload chứa ranking
};

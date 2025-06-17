import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createNewJob = async (formdata, token) => {
    console.log("token khi goi api", token);
    const response = await axios.post(
        `${API_URL}/jobs/createJob`,
        {
            ...formdata,
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getJobsByUserId = async (token) => {
    const response = await axios.get(`${API_URL}/jobs/getJobs/ByCompany`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getJobByJobId = async (jId) => {
    const response = await axios.get(`${API_URL}/jobs/getJob/${jId}`);
    return response.data;
};

export const updateJobById = async (updateData, jId, token) => {
    console.log(updateData);
    console.log(jId);
    const response = await axios.put(
        `${API_URL}/jobs/${jId}`,
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

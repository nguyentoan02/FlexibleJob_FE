import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createNewJob = async (formdata, token) => {
    const response = await axios.post(
        `${API_URL}/jobs/createJob`,
        {
            ...formdata,
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

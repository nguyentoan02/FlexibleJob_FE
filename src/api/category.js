import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const fetchCategory = async () => {
    const res = await axios.get(`${API_URL}/category`);
    return res.data;
};

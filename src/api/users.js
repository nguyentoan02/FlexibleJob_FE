import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const fetchUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

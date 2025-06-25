import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const fetchUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users/active`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const fetchBannedUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users/banned`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const banUser = async (token, userId, reason) => {
  const res = await axios.put(`${API_URL}/users/status/ban/${userId}`, {
    reason: reason
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const unbanUser = async (token, userId) => {
  const res = await axios.put(`${API_URL}/users/status/unban/${userId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

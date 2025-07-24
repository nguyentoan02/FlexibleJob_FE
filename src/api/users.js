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

// Package Management APIs
export const fetchPackages = async (token) => {
  const res = await axios.get(`${API_URL}/packages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.payload || res.data.data;
};

export const createPackage = async (token, packageData) => {
  const res = await axios.post(`${API_URL}/packages`, packageData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updatePackage = async (token, packageId, packageData) => {
  console.log('API CALL', packageId, packageData);
  const res = await axios.put(`${API_URL}/packages/${packageId}`, packageData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deletePackage = async (token, packageId) => {
  const res = await axios.delete(`${API_URL}/packages/${packageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchTotalUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users/total-users`, 
    token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  return res.data.total || res.data;
};

export const fetchTotalEmployers = async (token) => {
  const res = await axios.get(`${API_URL}/users/total-employers`, 
    token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  return res.data.total || res.data;
};

export const fetchTotalJobseekers = async (token) => {
  const res = await axios.get(`${API_URL}/users/total-jobseekers`, 
    token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  return res.data.total || res.data;
};

export const fetchTotalCompanies = async (token) => {
  const res = await axios.get(`${API_URL}/users/total-companies`, 
    token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  return res.data.total || res.data;
};

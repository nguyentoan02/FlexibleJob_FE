import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createPaymentLink = async (packageId, token) => {
    console.log(packageId);
    const response = await axios.post(
        `${API_URL}/payments/create-payment-link`,
        {
            packageId: packageId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const fetchRevenue = async (token) => {
  const res = await axios.get(`${API_URL}/payments/revenue`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  return res.data.revenue || res.data;
};

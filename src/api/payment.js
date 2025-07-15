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

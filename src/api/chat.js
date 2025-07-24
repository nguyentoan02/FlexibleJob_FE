import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createOrGetChat = async (jobseekerId, employerId, token) => {
    const response = await axios.post(
        `${API_URL}/chat/create`,
        { jobseekerId, employerId },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const createChatWithCompany = async (companyId, token) => {
    const response = await axios.post(
        `${API_URL}/chat/create-with-company`,
        { companyId },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const getUserChats = async (token, page = 1, limit = 20) => {
    const response = await axios.get(`${API_URL}/chat`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
    });
    return response.data;
};

export const getChatMessages = async (chatId, token, page = 1, limit = 50) => {
    const response = await axios.get(`${API_URL}/chat/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
    });
    return response.data;
};

export const sendMessage = async (
    chatId,
    content,
    token,
    messageType = "text"
) => {
    const response = await axios.post(
        `${API_URL}/chat/${chatId}/messages`,
        {
            content,
            messageType,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const markMessagesAsRead = async (chatId, token) => {
    const response = await axios.patch(
        `${API_URL}/chat/${chatId}/read`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const searchEmployers = async (
    searchTerm,
    token,
    page = 1,
    limit = 20
) => {
    const response = await axios.get(`${API_URL}/chat/search-employers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm, page, limit },
    });
    return response.data;
};

export const getAllEmployers = async (token, page = 1, limit = 20) => {
    const response = await axios.get(`${API_URL}/chat/employers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
    });
    return response.data;
};

import api from "./api";

export const getConversations = async () => {
    const response = await api.get('/messages/conversation');
    return response.data;
}
export const getChatHistory = async (otherUserId: number) => {
    const response = await api.get(`/messages/chat-history/${otherUserId}`);
    return response.data;
}
export const getCountUnreadMessages = async () => {
    const response = await api.get('/messages/unread-count');
    return response.data;
}
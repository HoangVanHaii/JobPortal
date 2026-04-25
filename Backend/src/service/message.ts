import { SavedMessageModel } from "../model/message";

export const getConversations = async (myId: number) => {
    const conversations = await SavedMessageModel.aggregate([
        {
            $match: {
                $or: [{ sender_id: myId }, { receiver_id: myId }]
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ["$sender_id", myId] },
                        "$receiver_id",
                        "$sender_id"
                    ]
                },
                latestMessage: { $first: "$content" },
                timestamp: { $first: "$createdAt" },
                lastSenderId: { $first: "$sender_id" },
                sender_name: { $first: "$sender_name" },
                sender_avatar: { $first: "$sender_avatar" },
                receiver_name: { $first: "$receiver_name" },
                receiver_avatar: { $first: "$receiver_avatar" },
                isRead: { $first: "$is_read" }

            }
        },
        { $sort: { timestamp: -1 } }
    ]);

    return conversations.map(c => ({
        userId: c._id,
        latestMessage: c.latestMessage,
        timestamp: c.timestamp,
        lastSenderId: c.lastSenderId,
        isRead: c.isRead,
        name: c.lastSenderId === myId ? c.receiver_name : c.sender_name,
        avatar: c.lastSenderId === myId ? c.receiver_avatar : c.sender_avatar
    })) ;
};
export const getChatHistory = async (myId: number, otherUserId: number) => {
    const messages = await SavedMessageModel.find({
        $or: [
            { sender_id: myId, receiver_id: otherUserId },
            { sender_id: otherUserId, receiver_id: myId }
        ]
    }).sort({ createdAt: 1 });
    return messages;
}
// đếm số lượng người dùng đã gửi tin nhắn chưa đọc đến mình
export const getCountUnreadMessages = async (myId: number) => {
    const count = await SavedMessageModel.aggregate([
        {
            $match: {
                receiver_id: myId,
                is_read: false
            }
        },
        {
            $group: {
                _id: "$sender_id",
                count: { $sum: 1 }
            }
        },
        {
            $count: "total"
        }
    ]);
    return count.length > 0 ? count[0].total : 0;
}
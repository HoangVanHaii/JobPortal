import { SavedMessageModel } from "../model/message";

export const getConversations = async (myId: number) => {
    const conversation = await SavedMessageModel.aggregate([
        {
            $match: {
                $or: [{ sender_id: myId }, { receiver_id: myId }]
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: {
                    $cond: [{ $eq: ["$sender_id", myId] }, "$receiver_id", "$sender_id"]
                },
                latestMessage: { $first: "$content" },
                timestamp: { $first: "$createdAt" },
                sender_role: { $first: "$sender_role" }
            }
        },
        { $sort: { timestamp: -1 } }
    ]);
    return conversation;
}
export const getChatHistory = async (myId: number, otherUserId: number) => {
    const messages = await SavedMessageModel.find({
        $or: [
            { sender_id: myId, receiver_id: otherUserId },
            { sender_id: otherUserId, receiver_id: myId }
        ]
    }).sort({ createdAt: 1 });
    return messages;
}
import { Document } from 'mongoose';

export interface IMessage extends Document {
    sender_id: number;
    receiver_id: number;
    sender_role: string;
    content: string;
    is_read: boolean;
    createdAt: Date;
    updatedAt: Date;
    sender_name: string;
    sender_avatar: string;
    receiver_name: string;
    receiver_avatar: string;
}
export interface SendMessagePayload {
    receiver_id: number;
    content: string;
}
export interface IConversation {
    userId: number;
    name: string;
    avatar: string;
    latestMessage: string;
    timestamp: Date;
    senderRole: string;
}
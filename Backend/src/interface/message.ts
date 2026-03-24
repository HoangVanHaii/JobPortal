import { Document } from 'mongoose';

export interface IMessage extends Document {
    sender_id: number;
    receiver_id: number;
    sender_role: string;
    content: string;
    is_read: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface SendMessagePayload {
    receiver_id: number;
    content: string;
}
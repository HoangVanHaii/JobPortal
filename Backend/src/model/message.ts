import mongoose, { Schema } from "mongoose";
import { IMessage } from "../interface/message";

const MessageSchema: Schema = new Schema({
    sender_id: { type: Number, required: true },
    receiver_id: { type: Number, required: true },
    sender_role: { type: String, required: true },
    content: { type: String, required: true },
    is_read: {type: Boolean, default: false}
}, {
    timestamps: true
})

export const SavedMessageModel = mongoose.model<IMessage>('Message', MessageSchema)
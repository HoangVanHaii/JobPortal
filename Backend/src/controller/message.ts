import { Request, Response, NextFunction } from 'express'
import *as messageService from '../service/message'

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myId = parseInt(req.user!.id.toString());        
        const conversations = await messageService.getConversations(myId);
        return res.status(200).json({
            success: true,
            message: "Lấy dữ liệu các hội thoại thành công",
            data: conversations
        });
    } catch (error) {
        next(error);
    }
}
export const getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myId = parseInt(req.user!.id.toString());
        const otherUserId = parseInt(req.params.otherUserId.toString());

        const messages = await messageService.getChatHistory(myId, otherUserId);
        return res.status(200).json({
            success: true,
            message: "Lấy chi tiết cuộc trò chuyện thành công",
            data: messages
        });
    } catch (error) {
        next(error);
    }
}
export const getCountUnreadMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myId = parseInt(req.user!.id.toString());
        const count = await messageService.getCountUnreadMessages(myId);
        return res.status(200).json({
            success: true,
            message: "Lấy số lượng tin nhắn chưa đọc thành công",
            data: count
        });
    } catch (error) {
        next(error);
    }
}

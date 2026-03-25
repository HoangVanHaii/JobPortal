import { Request, Response, NextFunction } from 'express'
import *as messageService from '../service/message'

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myId = parseInt(req.user!.id.toString());        
        const conversations = await messageService.getConversations(myId);
        return res.status(200).json(conversations);
    } catch (error) {
        next(error);
    }
}
export const getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myId = parseInt(req.user!.id.toString());
        const otherUserId = parseInt(req.params.otherUserId.toString());

        const messages = await messageService.getChatHistory(myId, otherUserId);
        return res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
}

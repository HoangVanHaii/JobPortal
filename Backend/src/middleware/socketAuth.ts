import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { SocketUser } from '../interface/socket';
export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
        if (!token) {
            return next(new Error('Từ chối kết nối: Chưa cung cấp token'));
        }
        const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const decoded: any = jwt.verify(actualToken, process.env.JWT_SECRET as string);

        socket.data.user = {
            id: decoded.userId,
            role: decoded.role
        } as SocketUser;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new Error('Từ chối kết nối: Token đã hết hạn'));
        }
        return next(new Error('Từ chối kết nối: Token không hợp lệ'));
    }
};
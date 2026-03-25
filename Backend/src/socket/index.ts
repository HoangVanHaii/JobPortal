import { Server, Socket } from 'socket.io'
import { socketAuthMiddleware } from '../middleware/socketAuth'
import { SavedMessageModel } from '../model/message';
import { SendMessagePayload } from '../interface/message';

export const setupSocket = (io: Server) => {
    io.use(socketAuthMiddleware);

    io.on('connection', (socket: Socket) => {
        const user = socket.data.user;
        console.log(`client connected: ${socket.id} | UserID: ${user.id} | Role: ${user.role}`);
        socket.join(user.id.toString());

        socket.on('send_message', async (payload: SendMessagePayload) => {
            try {
                const savedMessage = await SavedMessageModel.create({
                    sender_id: user.id,
                    receiver_id: payload.receiver_id,
                    sender_role: user.role,
                    content: payload.content
                })

                const messageData = {
                    _id: savedMessage._id,
                    sender_id: savedMessage.sender_id,
                    sender_role: savedMessage.sender_role,
                    content: savedMessage.content,
                    timestamp: savedMessage.createdAt   
                }

                io.to(payload.receiver_id.toString()).emit('receive_message', messageData);
                socket.emit('message_sent_success', messageData);   
            } catch (error) {
                console.log('lỗi khi gửi tin', error);
                socket.emit('message_error', { message: 'Lỗi server, không thể gửi tin nhắn' });
            }
        })
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id} (User: ${user.id})`)
        })
    })
}
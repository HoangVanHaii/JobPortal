import { Server, Socket } from 'socket.io'
import { socketAuthMiddleware } from '../middleware/socketAuth'
import { SavedMessageModel } from '../model/message';
import { SendMessagePayload } from '../interface/message';
import { getProfileWithCache } from '../service/user';
import { IProfile } from '../interface/user';

export const setupSocket = (io: Server) => {
    io.use(socketAuthMiddleware);

    io.on('connection', (socket: Socket) => {
        const user = socket.data.user;
        console.log(`client connected: ${socket.id} | UserID: ${user.id} | Role: ${user.role}`);
        socket.join(user.id.toString());

        socket.on('send_message', async (payload: SendMessagePayload) => {
            const [ sender, receiver] = await Promise.all([
                getProfileWithCache(user.id) as Promise<IProfile>,
                getProfileWithCache(payload.receiver_id) as Promise<IProfile>
            ]);
            try {
                const savedMessage = await SavedMessageModel.create({
                    sender_id: user.id,
                    receiver_id: payload.receiver_id,
                    sender_role: user.role,
                    content: payload.content,
                    is_read: false,
                    sender_name: sender.Name,
                    sender_avatar: sender.ImgUrl,
                    receiver_name: receiver.Name,
                    receiver_avatar: receiver.ImgUrl
                })

                const messageData = {
                    _id: savedMessage._id,
                    sender_id: savedMessage.sender_id,
                    sender_role: savedMessage.sender_role,
                    content: savedMessage.content,
                    is_read: false,
                    timestamp: savedMessage.createdAt,
                    sender_name: savedMessage.sender_name,
                    sender_avatar: savedMessage.sender_avatar,
                    receiver_name: savedMessage.receiver_name,
                    receiver_avatar: savedMessage.receiver_avatar
                }

                io.to(payload.receiver_id.toString()).emit('receive_message', messageData);
                socket.emit('message_sent_success', messageData);   
            } catch (error) {
                console.log('lỗi khi gửi tin', error);
                socket.emit('message_error', { message: 'Lỗi server, không thể gửi tin nhắn' });
            }
        })
        socket.on('mark_as_read', async (otherUserId: number) => {
            try {
                await SavedMessageModel.updateMany(
                    { sender_id: otherUserId, receiver_id: user.id, is_read: false },
                    { $set: { is_read: true } }
                );
                io.to(otherUserId.toString()).emit('messages_marked_as_read', { readerId: user.id });
                socket.emit('mark_as_read_success', { sender_id: otherUserId });
            } catch (error) {
                console.log('Lỗi khi đánh dấu tin nhắn đã đọc', error);
            }
        });
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id} (User: ${user.id})`)
        })
    })
}
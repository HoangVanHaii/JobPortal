import { createClient } from "redis";
import { AppError } from "../utils/appError";
import dotenv from "dotenv";
dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
})
redisClient.on('error', (err) => console.error('Lỗi Redis:', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('Kết nối Redis thành công!');
    } catch (error) {
        console.error('Kết nối Redis thất bại:', error);
        throw new AppError('Kết nối Redis thất bại', 500);
    }
})();

export default redisClient;

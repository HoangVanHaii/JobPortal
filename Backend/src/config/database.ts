import mysql, {Pool} from 'mysql2/promise';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const pool : Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const connectDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Kết nối MySQL thành công!');
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017');
        console.log('Kết nối MongoDB thành công!');
        connection.release();
    } catch (error) {
        console.error('Kết nối MySQL hoặc MongoDB thất bại:', error);
        process.exit(1);
    }
};

export default pool;
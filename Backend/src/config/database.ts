import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const connectMySQL = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Connected successfully!');
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017');
        console.log('✅ MongoDB Connected successfully!');
        connection.release();
    } catch (error) {
        console.error('❌ MySQL Connection failed:', error);
        process.exit(1);
    }
};

export default pool;
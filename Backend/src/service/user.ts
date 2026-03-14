import pool from "../config/database";
import { AppError } from "../utils/appError";

export const searchUserByEmail = async (email: string) => {
    try {
        const query = "SELECT * FROM users WHERE Email = ?";
        const [rows]: any = await pool.query(query, [email]);

        return rows[0];
    } catch (error) {
        throw new AppError('Lỗi khi truy vấn cơ sở dữ liệu', 500);
    }
}
export const createUser = async (email: string, password: string, role: string) => {
    try {
        const query = "INSERT INTO users (Email, PasswordHash, Role) VALUES (?, ?, ?)";
        const values = [email, password, role ?? 'Candidate'];
        const [result]: any = await pool.query(query, values);
        return result.insertId;
    } catch (error) {
        console.error('Lỗi tạo tài khoản:', error);
        throw new AppError('Lỗi khi tạo tài khoản', 500);
    }   
}
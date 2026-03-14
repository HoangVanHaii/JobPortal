import pool from "../config/database";
import { AppError } from "../utils/appError";

export const searchUserByEmail = async (email: string) => {
    try {
        const query = "SELECT * FROM users WHERE Email = ?";
        const [rows]: any = await pool.query(query, [email]);

        return rows[0];
    } catch (error) {
        throw new AppError('Lỗi khi truy vấn cơ sở dữ liệu', 500, false);
    }
}
export const searchUserById = async (userId: number) => {
    try {
        const query = "SELECT * FROM users WHERE UserID = ?";
        const [rows]: any = await pool.query(query, [userId]);
        return rows[0];
    } catch (error) {
        throw new AppError('Lỗi khi truy vấn cơ sở dữ liệu', 500, false);
    }
}
export const createUser = async (email: string, password: string, role: string) => {
    try {
        const query = "INSERT INTO users (Email, PasswordHash, Role) VALUES (?, ?, ?)";
        const values = [email, password, role ?? 'Candidate'];
        const [result]: any = await pool.query(query, values);
        return result.insertId;
    } catch (error) {
        throw new AppError('Lỗi khi tạo tài khoản', 500, false);
    }
}
export const getAllUsers = async () => {
    try {
        const query = "SELECT UserID, Email, Role, Status FROM users";
        const [rows]: any = await pool.query(query);
        return rows;
    } catch (error) {
        throw new AppError('Lỗi khi truy vấn cơ sở dữ liệu', 500, false);
    }
}
export const updateUserStatus = async (userId: number, status: string) => {
    try {
        const query = "UPDATE users SET Status = ? WHERE UserID = ?";
        await pool.query(query, [status, userId]);
    } catch (error) {
        throw new AppError('Lỗi khi cập nhật trạng thái người dùng', 500, false);
    }
}
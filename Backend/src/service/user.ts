import pool from "../config/database";

export const searchUserByEmail = async (email: string) => {
    const query = "SELECT * FROM users WHERE Email = ?";
    const [rows]: any = await pool.query(query, [email]);
    return rows[0];
}
export const searchUserById = async (userId: number) => {
    const query = "SELECT * FROM users WHERE UserID = ?";
    const [rows]: any = await pool.query(query, [userId]);
    return rows[0];
}
export const createUser = async (email: string, password: string, role: string) => {
    const query = "INSERT INTO users (Email, PasswordHash, Role) VALUES (?, ?, ?)";
    const values = [email, password, role ?? 'Candidate'];
    const [result]: any = await pool.query(query, values);
    return result.insertId;
}
export const getAllUsers = async () => {
    const query = "SELECT UserID, Email, Role, Status FROM users";
    const [rows]: any = await pool.query(query);
    return rows;
}
export const updateUserStatus = async (userId: number, status: string) => {
    const query = "UPDATE users SET Status = ? WHERE UserID = ?";
    await pool.query(query, [status, userId]);
}
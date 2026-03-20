import pool from "../config/database"; 
import { AppError } from '../utils/appError';

export const getAllSkills = async () => {
    const query = `SELECT * FROM Skills ORDER BY SkillName ASC`;
    const [rows]: any = await pool.query(query);
    return rows;
};

export const getSkillById = async (skillId: number) => {
    const query = `SELECT * FROM Skills WHERE SkillID = ?`;
    const [rows]: any = await pool.query(query, [skillId]);
    return rows[0]; 
};

export const deleteSkill = async (skillId: number) => {
    const query = `DELETE FROM Skills WHERE SkillID = ?`;
    const [result]: any = await pool.query(query, [skillId]);
    
    return result.affectedRows > 0;
};

export const createSkill = async (skillName: string) => {
    const cleanName = skillName.trim();

    const checkQuery = `SELECT SkillID FROM Skills WHERE SkillName = ?`;
    const [existing]: any = await pool.query(checkQuery, [cleanName]);
    
    if (existing.length > 0) {
        throw new AppError(`Kỹ năng '${cleanName}' đã có trong hệ thống rồi sếp ơi!`, 400);
    }

    const query = `INSERT INTO Skills (SkillName) VALUES (?)`;
    const [result]: any = await pool.query(query, [cleanName]);
    
    return { SkillID: result.insertId, SkillName: cleanName };
};

export const updateSkill = async (skillId: number, newSkillName: string) => {
    const cleanName = newSkillName.trim();

    const checkQuery = `SELECT SkillID FROM Skills WHERE SkillName = ? AND SkillID != ?`;
    const [existing]: any = await pool.query(checkQuery, [cleanName, skillId]);
    
    if (existing.length > 0) {
        throw new AppError(`Tên '${cleanName}' bị trùng với một kỹ năng khác rồi!`, 400);
    }

    const query = `UPDATE Skills SET SkillName = ? WHERE SkillID = ?`;
    const [result]: any = await pool.query(query, [cleanName, skillId]);
    
    return result.affectedRows > 0;
};
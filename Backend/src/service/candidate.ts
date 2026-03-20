import pool from "../config/database";
import { Candidate } from "../interface/candidate";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as skillService from "./skill";

export const upsertCandidateProfile = async (data: Candidate) => {
    const query = `INSERT INTO Candidates (CandidateID, FullName, Phone, DateOfBirth, Address, ExperienceYears, Education, AvatarUrl)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE
                       FullName = VALUES(FullName),
                       Phone = VALUES(Phone),
                       DateOfBirth = VALUES(DateOfBirth),
                       Address = VALUES(Address),
                       ExperienceYears = VALUES(ExperienceYears),
                       Education = VALUES(Education),
                       AvatarUrl = VALUES(AvatarUrl)
                  `;
    const values = [
        data.CandidateID, 
        data.FullName, 
        data.Phone || null, 
        data.DateOfBirth || null, 
        data.Address || null, 
        data.ExperienceYears || 0, 
        data.Education || null, 
        data.AvatarUrl || null
    ];

    const [result]: any = await pool.query(query, values);
    return result;
};

export const getCandidateProfile = async (userId: number) => {
    const query = `
        SELECT u.Email, u.Role, u.Status, c.*
        FROM Users u
        JOIN Candidates c ON u.UserID = c.CandidateID
        WHERE u.UserID = ?
    `;
    const [rows]: any = await pool.query(query, [userId]);
    if (rows.length === 0) return null;
    return rows[0];
};

export const getCandidateSkills = async (userId: number) => {
    const query = `
        SELECT s.SkillID, s.SkillName, cs.SkillLevel
        FROM CandidateSkills cs
        JOIN Skills s ON cs.SkillID = s.SkillID
        WHERE cs.CandidateID = ?
    `;
    const [rows]: any = await pool.query(query, [userId]);
    return rows;
};


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
export const analyzeTextWithAI = async (rawText: string) => {
    const allSkills = await skillService.getAllSkills(); 
    const dictionary = allSkills.map((s: any) => ({ id: s.SkillID, name: s.SkillName }));

    const prompt = `
        Bạn là một Trưởng phòng Nhân sự cấp cao đa ngành nghề. Dưới đây là đoạn văn bản ứng viên mô tả kỹ năng của họ:
        "${rawText}"
        
        Và đây là danh sách CÁC KỸ NĂNG CHUẨN đang có trong hệ thống database của tôi:
        ${JSON.stringify(dictionary)}
        
        Nhiệm vụ của bạn:
        1. Trích xuất TẤT CẢ các kỹ năng từ đoạn văn bản trên.
        2. Đối chiếu với danh sách chuẩn. Nếu khớp (kể cả đồng nghĩa/viết tắt), hãy lấy 'id' chuẩn.
        3. QUAN TRỌNG: Nếu ứng viên có một kỹ năng MỚI HOÀN TOÀN (không có trong danh sách), hãy trích xuất nó và gán 'id' là chuỗi "new".
        4. CHỈ trả về một mảng JSON với cấu trúc object. TUYỆT ĐỐI không trả về chữ hay giải thích thêm.
        
        Ví dụ định dạng trả về chuẩn:
        [
            { "id": 1, "name": "Digital Marketing" },
            { "id": 5, "name": "English" },
            { "id": "new", "name": "Livestream TikTok" }
        ]
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let parsedResults: any[] = [];
    try {
        parsedResults = JSON.parse(responseText);
    } catch (e) {
        console.error("Lỗi AI:", responseText);
        throw new Error("AI_PARSE_ERROR"); 
    }

    const finalSkills = parsedResults.map((item: any) => {
        if (item.id === "new") {
            return {
                isNew: true, 
                skillId: null,
                skillName: item.name
            };
        } else {
            const dbSkill = allSkills.find((s: any) => s.SkillID === item.id);
            return {
                isNew: false, 
                skillId: item.id,
                skillName: dbSkill ? dbSkill.SkillName : item.name
            };
        }
    });
    
    return finalSkills;
};

export const updateCandidateSkills = async (userId: number, skillsToSave: any[]) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(`DELETE FROM CandidateSkills WHERE CandidateID = ?`, [userId]); //xóa skill cũ

        for (const skill of skillsToSave) {
            let currentSkillId = skill.skillId;
            if (skill.isNew === true) {
                const [insertResult]: any = await connection.query(
                    `INSERT INTO Skills (SkillName) VALUES (?)`, 
                    [skill.skillName.trim()] 
                );
                currentSkillId = insertResult.insertId; 
            }

            await connection.query(
                `INSERT INTO CandidateSkills (CandidateID, SkillID, SkillLevel) VALUES (?, ?, ?)`,
                [userId, currentSkillId, skill.level || 'Intermediate'] 
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        // throw error;
    } finally {
        connection.release();
    }
};


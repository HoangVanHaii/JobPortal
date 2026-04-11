import { GoogleGenAI } from '@google/genai';
import pool from "../config/database"; 
import { AppError } from '../utils/appError';
import { iResumeDetail,iResume } from '../interface/resume';
import { updateCandidateSkills } from './candidate';
import ResumeDetail from '../model/resumeDetail';
import { generateAndStoreVector } from '../utils/ai';
const ai = new GoogleGenAI({});

export const generateResumeSummary = async (resumeData: any) => {
    try {
        const skills = resumeData.skills ? resumeData.skills.map((s: any) => s.skillName || s).join(', ') : 'Chưa cập nhật';
        
        let experienceText = '';
        if (resumeData.experience && resumeData.experience.length > 0) {
            experienceText = resumeData.experience.map((exp: any) => 
                `- ${exp.position} tại ${exp.companyName} (${exp.description || 'Không mô tả'})`
            ).join('\n');
        } else {
            experienceText = 'Chưa có kinh nghiệm thực tế (Fresher/Intern).';
        }

        let educationText = '';
        if (resumeData.education && resumeData.education.length > 0) {
            educationText = resumeData.education.map((edu: any) => 
                `- ${edu.degree} ngành ${edu.major} tại ${edu.institution}`
            ).join('\n');
        }

        const prompt = `
        Bạn là một chuyên gia tuyển dụng (HR Director) tài ba. 
        Nhiệm vụ của bạn là viết MỘT đoạn văn ngắn (khoảng 3-4 câu, dưới 100 chữ) để làm phần "Tóm tắt mục tiêu nghề nghiệp (Summary)" cho CV của một ứng viên.
        
        YÊU CẦU NGHIÊM NGẶT:
        - Giọng văn: Chuyên nghiệp, tự tin, mang danh xưng ngôi thứ nhất (tôi).
        - Nêu bật được thế mạnh dựa trên dữ liệu bên dưới.
        - Trả về ĐÚNG MỘT ĐOẠN VĂN, không có tiêu đề, không có gạch đầu dòng, không giải thích gì thêm.

        DỮ LIỆU CỦA ỨNG VIÊN:
        * Kỹ năng: ${skills}
        * Kinh nghiệm: 
        ${experienceText}
        * Học vấn:
        ${educationText}
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error);
        throw new AppError("Hệ thống AI đang quá tải, sếp chịu khó tự gõ tóm tắt nhé!", 500);
    }
};

const buildResumeRichText = (data: iResumeDetail) => {
    const skills = data.skills ? data.skills.map((s: any) => s.skillName || s).join(', ') : 'Chưa có';
    const experience = data.experience ? data.experience.map((e: any) => `${e.position} tại ${e.companyName}`).join('. ') : 'Chưa có';
    const education = data.education ? data.education.map((e: any) => `${e.degree} ngành ${e.major}`).join('. ') : 'Chưa có';
    
    return `Tiêu đề CV: ${data.title || ''}. Tóm tắt: ${data.summary || ''}. Kỹ năng chuyên môn: ${skills}. Kinh nghiệm làm việc: ${experience}. Học vấn: ${education}.`;
};

// export const buildManualResume = async (candidateId: number, resumeData: iResumeDetail) => {
//     const newResumeDetail = new ResumeDetail({
//         candidateId,
//         title: resumeData.title || 'CV Chưa Đặt Tên',
//         summary: resumeData.summary,
//         skills: resumeData.skills || [], 
//         experience: resumeData.experience || [],
//         education: resumeData.education || [],
//         projects: resumeData.projects || []
//     });
    
//     const savedMongoResume = await newResumeDetail.save();
//     const mongoIdString = savedMongoResume._id.toString();

//     if (resumeData.skills && resumeData.skills.length > 0) {
//         await updateCandidateSkills(candidateId, resumeData.skills);
//     }

//     const query = `
//         INSERT INTO Resumes (CandidateID, Title, MongoResumeID, Summary, IsAnalyzed) 
//         VALUES (?, ?, ?, ?, ?)
//     `;
    
//     const [result]: any = await pool.query(query, [
//         candidateId, 
//         resumeData.title || 'CV Chưa Đặt Tên', 
//         mongoIdString, 
//         resumeData.summary || null,
//         true 
//     ]);

//     const newResumeId = result.insertId;


//     const richText = buildResumeRichText(resumeData); 
//     const vectorId = await generateAndStoreVector(richText, 'resume', newResumeId); 

//     await pool.query('UPDATE Resumes SET VectorID = ? WHERE ResumeID = ?', [vectorId, newResumeId]);

//     return {
//         resumeId: newResumeId,
//         mongoResumeId: mongoIdString,
//         vectorId: vectorId 
//     };
// };
export const buildManualResume = async (candidateId: number, resumeData: iResumeDetail) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction(); 

    try {
        const insertQuery = `
            INSERT INTO Resumes (CandidateID, Title, Summary, IsAnalyzed) 
            VALUES (?, ?, ?, ?)
        `;
        const [result]: any = await connection.query(insertQuery, [
            candidateId, 
            resumeData.title || 'CV Chưa Đặt Tên', 
            resumeData.summary || null,
            true 
        ]);
        const newResumeId = result.insertId;

        const newResumeDetail = new ResumeDetail({
            resumeId: newResumeId, 
            title: resumeData.title || 'CV Chưa Đặt Tên',
            summary: resumeData.summary,
            skills: resumeData.skills || [], 
            experience: resumeData.experience || [],
            education: resumeData.education || [],
            projects: resumeData.projects || []
        });
        
        await newResumeDetail.save();

        if (resumeData.skills && resumeData.skills.length > 0) {
            await updateCandidateSkills(candidateId, resumeData.skills);
        }
        const richText = buildResumeRichText(resumeData); 
        const vectorId = await generateAndStoreVector(richText, 'resume', newResumeId); 
        
        await connection.query(
            'UPDATE Resumes SET VectorID = ? WHERE ResumeID = ?', 
            [vectorId, newResumeId]
        );

        await connection.commit();

        return { 
            resumeId: newResumeId, 
            vectorId: vectorId 
        };

    } catch (error) {
        await connection.rollback();
        console.error("Lỗi tạo CV:", error);
        throw new AppError("Có lỗi xảy ra khi tạo CV, vui lòng thử lại!", 500);
    } finally {
        connection.release();
    }
};

export const getCandidateResumes = async (candidateId: number) => {
    const query = `SELECT 
            ResumeID, 
            Title, 
            Summary, 
            IsAnalyzed, 
            CreatedAt 
        FROM Resumes 
        WHERE CandidateID = ? 
        ORDER BY CreatedAt DESC`;
    const [rows]: any = await pool.query(query, [candidateId]);
    return rows;
}

export const getResumeDetail = async (resumeId: number) => {
    return await ResumeDetail.findOne({ resumeId: resumeId });
};


export const updateManualResume = async (candidateId: number, mongoId: string, resumeData: iResumeDetail) => {
    // 1. Cập nhật Mongo
    const updatedMongoResume = await ResumeDetail.findOneAndUpdate(
        { _id: mongoId, candidateId: candidateId }, 
        {
            title: resumeData.title,
            summary: resumeData.summary,
            skills: resumeData.skills || [],
            experience: resumeData.experience || [],
            education: resumeData.education || [],
            projects: resumeData.projects || []
        },
        { new: true } 
    );

    if (!updatedMongoResume) {
        throw new AppError("Không tìm thấy CV này hoặc sếp không có quyền chỉnh sửa!", 404);
    }

    if (resumeData.skills && resumeData.skills.length > 0) {
        await updateCandidateSkills(candidateId, resumeData.skills);
    }

    const updateMysqlQuery = `
        UPDATE Resumes 
        SET Title = ?, Summary = ? 
        WHERE MongoResumeID = ? AND CandidateID = ?
    `;
    await pool.query(updateMysqlQuery, [
        resumeData.title, 
        resumeData.summary || null, 
        mongoId, 
        candidateId
    ]);
    const [rows]: any = await pool.query('SELECT ResumeID FROM Resumes WHERE MongoResumeID = ?', [mongoId]);
    
    if (rows.length > 0) {
        const resumeIdInt = rows[0].ResumeID;
        const richText = buildResumeRichText(resumeData);
        const newVectorId = await generateAndStoreVector(richText, 'resume', resumeIdInt);
        await pool.query('UPDATE Resumes SET VectorID = ? WHERE ResumeID = ?', [newVectorId, resumeIdInt]);
    }

    return updatedMongoResume;
};

export const deleteResume = async (mongoId: string, candidateId: number) => {
    const deletedMongoResume = await ResumeDetail.findOneAndDelete({
        _id: mongoId,
        candidateId: candidateId
    });

    if (!deletedMongoResume) {
        throw new AppError("Không tìm thấy CV để xóa hoặc sếp không có quyền!", 404);
    }

    const query = `DELETE FROM Resumes WHERE MongoResumeID = ? AND CandidateID = ?`;
    await pool.query(query, [mongoId, candidateId]);

    return true;
};

export const getResumeForEmployer = async (mongoId: string) => {
    const detail = await ResumeDetail.findById(mongoId);
    
    if (!detail) {
        throw new AppError("Không tìm thấy CV này hoặc ứng viên đã xóa!", 404);
    }
    
    return detail;
};

export const getResumeForResumeId = async (resumeId: string) => {

}


import { GoogleGenAI } from '@google/genai';
import pool from "../config/database"; 
import { AppError } from '../utils/appError';
import { iResumeDetail,iResume } from '../interface/resume';
import { updateCandidateSkills } from './candidate';
import ResumeDetail from '../model/resumeDetail';
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

export const buildManualResume = async (candidateId: number, resumeData: iResumeDetail) => {
    const newResumeDetail = new ResumeDetail({
        candidateId,
        title: resumeData.title || 'CV Chưa Đặt Tên',
        summary: resumeData.summary,
        skills: resumeData.skills || [], 
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        projects: resumeData.projects || []
    });
    
    const savedMongoResume = await newResumeDetail.save();
    const mongoIdString = savedMongoResume._id.toString();

    if (resumeData.skills && resumeData.skills.length > 0) {
        await updateCandidateSkills(candidateId, resumeData.skills);
    }

    const query = `
        INSERT INTO Resumes (CandidateID, Title, MongoResumeID, Summary, IsAnalyzed) 
        VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result]: any = await pool.query(query, [
        candidateId, 
        resumeData.title || 'CV Chưa Đặt Tên', 
        mongoIdString, 
        resumeData.summary || null,
        true 
    ]);

    return {
        resumeId: result.insertId,
        mongoResumeId: mongoIdString
    };
};

export const getCandidateResumes = async(candidateId: number) =>{
    const query = `SELECT 
            ResumeID, 
            Title, 
            MongoResumeID, 
            Summary, 
            IsAnalyzed, 
            CreatedAt 
        FROM Resumes 
        WHERE CandidateID = ? 
        ORDER BY CreatedAt DESC`
    const [rows]:any= await pool.query( query,[candidateId]);
    return rows;
}

export const getResumeDetail = async (mongoId: string, candidateId: number) => {
    const resumeDetail = await ResumeDetail.findOne({ 
        _id: mongoId,
        candidateId: candidateId 
    });

    if (!resumeDetail) {
        throw new AppError("Không tìm thấy chi tiết CV này hoặc sếp không có quyền xem!", 404);
    }

    return resumeDetail;
};
export const getResumeDetailByCandidateId = async (candidateId: number) => {
    const resumeDetail = await ResumeDetail.findOne({ 
        candidateId: candidateId 
    });

    if (!resumeDetail) {
        throw new AppError("Không tìm thấy chi tiết CV này", 404);
    }
    return resumeDetail as iResumeDetail;
}

export const updateManualResume = async (candidateId: number, mongoId: string, resumeData: iResumeDetail) => {
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

    const query = `
        UPDATE Resumes 
        SET Title = ?, Summary = ? 
        WHERE MongoResumeID = ? AND CandidateID = ?
    `;
    await pool.query(query, [
        resumeData.title, 
        resumeData.summary || null, 
        mongoId, 
        candidateId
    ]);

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
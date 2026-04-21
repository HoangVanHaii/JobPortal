import { GoogleGenerativeAI } from "@google/generative-ai";
import { pineconeIndex } from "../config/pinecone";
import { iResumeDetail } from "../interface/resume";
import pool from "../config/database";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateEmbedding = async (text: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const result = await model.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error("Lỗi khi tạo Embedding với Gemini:", error);
        throw error;
    }
};
export const searchJobsByAI = async (searchQuery: string, topK: number = 10) => {
    try {
        const queryVector = await generateEmbedding(searchQuery);

        const queryResponse = await pineconeIndex.query({
            vector: queryVector,
            topK: topK,
            includeMetadata: true, 
        });

        const matchedResults = queryResponse.matches.map((match: any) => ({
            jobId: Number(match.id),
            score: match.score || 0
        }));

        return matchedResults;
    } catch (error) {
        console.error("[AI-SEARCH-ERROR] Lỗi khi tìm kiếm vector:", error);
        throw error;
    }
};
export const generateJobInsights = async (searchQuery: string, jobText: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
        Bạn là HR Director. Ứng viên đang tìm kiếm: "${searchQuery}".
        Thông tin công việc: "${jobText}".
        Hãy viết ĐÚNG 2 câu ngắn gọn (dưới 40 chữ) giải thích tại sao công việc này phù hợp với họ. Xưng "bạn". Không dùng gạch đầu dòng.
        `;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Lỗi khi sinh Insight:", error);
        throw error;
    }
};


///////////////////////////////////////
export const RecommendJobsByAI = async (resume: iResumeDetail) => {
    await deleteJobRecommentCandidate(1);

    const resumeText = buildResumeText(resume);
    const resumeVector = await generateEmbedding(resumeText);
    const queryResponse = await pineconeIndex.query({
        vector: resumeVector,
        topK: 20,
        includeMetadata: true, 
    });
    const candidateId = 1;
    saveJobRecommendations(candidateId, queryResponse.matches);

}
export const saveJobRecommendations = async ( candidateId: number, matches: any[]) => {
    await Promise.all(
        matches.map(item =>
            pool.query(
                `INSERT INTO JobRecommendations (CandidateID, JobID, Score)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                 Score = VALUES(Score),
                 RecommendedAt = CURRENT_TIMESTAMP`,
                [
                    candidateId,
                    Number(item.id),
                    item.score
                ]
            )
        )
    );
};
export const deleteJobRecommentCandidate = async (candidateId: number) => {
    await pool.query(
        `DELETE FROM JobRecommendations WHERE CandidateID = ?`,
        [candidateId]
    );
};
export const buildResumeText = (resume: iResumeDetail): string => {
    const skillsText = resume.skills?.map(s => 
        `${s.skillName}${s.level ? ` (${s.level})` : ""}`
    ).join(", ");
    const experienceText = resume.experience?.map(exp => `
        - ${exp.position} at ${exp.companyName}
        (${exp.startDate?.toISOString().slice(0,7)} - ${exp.isCurrent ? "Present" : exp.endDate?.toISOString().slice(0,7)})
        ${exp.description || ""}
    `).join("\n");
    const educationText = resume.education?.map(edu => `
        - ${edu.degree} in ${edu.major} at ${edu.institution}
        (${edu.startDate?.toISOString().slice(0,7)} - ${edu.endDate?.toISOString().slice(0,7)})
        ${edu.gpa ? `GPA: ${edu.gpa}` : ""}
    `).join("\n");
    const projectText = resume.projects?.map(p => `
        - ${p.projectName} (${p.role})
        Technologies: ${p.technologies.join(", ")}
        ${p.description || ""}
    `).join("\n");
    return `
    Candidate Profile

    Title: ${resume.title || ""}
    Summary: ${resume.summary || ""}

    Skills:
    ${skillsText || ""}

    Work Experience:
    ${experienceText || ""}

    Education:
    ${educationText || ""}

    Projects:
    ${projectText || ""}
    `;
};
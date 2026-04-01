import { GoogleGenerativeAI } from "@google/generative-ai";
import { pineconeIndex } from "../config/pinecone";
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

        const matchedResults = queryResponse.matches.map(match => ({
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


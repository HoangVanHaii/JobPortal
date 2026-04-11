import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from '@google/genai';
import { AppError } from './appError';

const ai = new GoogleGenAI({});
const pc = new Pinecone({apiKey: process.env.PINECONE_API_KEY as string});

export const generateAndStoreVector = async (
    textToEmbed: string,             
    type: 'resume' | 'job',          
    entityId: number                 
) => {
    try {
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001', 
            contents: textToEmbed,
            config: {
                outputDimensionality: 768 
            }
        });
        console.log(response)

        const vectorValues = response.embeddings?.[0]?.values; 

        if (!vectorValues) {
             throw new AppError("Lỗi kết nối API: Gemini không trả về dữ liệu Vector Embedding!", 500);
        }

        const vectorId = `${type}_vec_${entityId}`;
        const index = pc.index({ name: 'job-portal-index' });
        await index.upsert({
            records: [
                {
                    id: vectorId,
                    values: vectorValues, 
                    metadata: { 
                        type: type,           
                        entityId: entityId,
                        // 👇 Thêm đúng 1 dòng này vào để theo dõi (Tracking)
                        updatedAt: new Date().toISOString() 
                    } 
                }
            ]
        });

        return vectorId;

    } catch (error) {
        console.error(`Lỗi khi tạo Vector cho ${type}:`, error);
        throw error;
    }
};
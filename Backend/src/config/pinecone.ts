import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
});

export const pineconeIndex = pc.index({name: 'job-portal-index'});

export const connectPinecone = async () => {
    try {
        const description = await pc.describeIndex('job-portal-index');
        console.log(`[PI-LOG] Đã kết nối Pinecone Index: ${description.name}`);
    } catch (error) {
        console.error('[PI-ERROR] Không thể kết nối tới Pinecone:', error);
    }
};
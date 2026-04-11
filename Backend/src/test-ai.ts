import 'dotenv/config'; // ⚠️ Dòng này cực kỳ quan trọng để nó đọc được chìa khóa API trong file .env
import { generateAndStoreVector } from './utils/ai';

const runTest = async () => {
    try {
        console.log("🚀 Đang nhờ Gemini đọc text và nhúng Vector...");
        
        // Data giả để test
        const textGiaLap = "Tuyển dụng Lập trình viên Backend Node.js, yêu cầu 2 năm kinh nghiệm, lương 2000$";
        
        // Gọi hàm của sếp: loại là 'job', ID giả là 999
        const vectorId = await generateAndStoreVector(textGiaLap, 'job', 999);
        
        console.log("✅ THÀNH CÔNG RỰC RỠ!");
        console.log("🎯 Vector ID vừa tạo ra là:", vectorId);
        console.log("👉 Giờ sếp lên web Pinecone kiểm tra ngay cho nóng!");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Ối giời ơi lỗi rồi sếp:", error);
        process.exit(1);
    }
};

runTest();
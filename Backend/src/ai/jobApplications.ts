import { IJobDetail } from "../interface/job";
import { GoogleGenAI } from '@google/genai';
import { iResumeDetail } from "../interface/resume";
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY as string
});

export const analyzeAI = async (job: IJobDetail, cv: iResumeDetail, applicationID: number) => {
    console.log(`[AI] đang phân tích ApplicationID ${applicationID}...`);
    const prompt = `
        Bạn là một AI hỗ trợ tuyển dụng nhân sự (HR AI Assistant).

        Nhiệm vụ của bạn là đánh giá mức độ phù hợp giữa CV của ứng viên và mô tả công việc.

        =====================
        MÔ TẢ CÔNG VIỆC
        =====================
        ${formatJob(job)}

        =====================
        CV ỨNG VIÊN
        =====================
        ${formatCV(cv)}

        =====================
        NGUYÊN TẮC ĐÁNH GIÁ
        =====================
        - Đánh giá mức độ phù hợp tổng thể giữa ứng viên và công việc.
        - Xem xét các yếu tố: kỹ năng, kinh nghiệm, học vấn và mức độ liên quan đến vị trí.
        - MatchScore phải là số từ 0 đến 100.
        - Đánh giá khách quan, nhất quán và dựa trên thông tin thực tế.
        - Không đánh giá cao nếu ứng viên thiếu các kỹ năng cốt lõi của công việc.
        - Nếu ứng viên thiếu kỹ năng bắt buộc, MatchScore không nên vượt quá 60.
        - Ưu tiên kinh nghiệm thực tế và dự án liên quan trực tiếp.

        =====================
        YÊU CẦU QUAN TRỌNG
        =====================
        1. Chỉ trả về JSON hợp lệ (VALID JSON).
        2. Không sử dụng markdown.
        3. Không thêm bất kỳ nội dung nào ngoài JSON.
        4. Trường "AI_Summary_Review" phải viết bằng tiếng Việt.
        5. Nội dung nhận xét gồm 2–3 câu ngắn gọn.
        6. Văn phong chuyên nghiệp, dễ hiểu đối với nhà tuyển dụng.
        7. Các giá trị số phải là kiểu number (không phải chuỗi).

        =====================
        ĐỊNH DẠNG KẾT QUẢ
        =====================
        {
            "MatchScore": number,
            "AI_Summary_Review": "Nhận xét ngắn gọn 2-3 câu bằng tiếng Việt mô tả mức độ phù hợp của ứng viên với công việc."
        }
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json", 
        }
    });
    if (!response.text) {
        throw new Error("[AI] không trả về kết quả đánh giá!");
    }
    const jsonResult = JSON.parse(response.text);
    console.log(`[AI] đã hoàn thành phân tích ApplicationID ${applicationID}`);

    return jsonResult;
}

export function formatJob(job: IJobDetail): string {
  return `
    JOB TITLE:
    ${job.Title}

    COMPANY:
    ${job.CompanyName}

    DESCRIPTION:
    ${job.Description}

    REQUIREMENTS:
    ${Array.isArray(job.Requirements)
        ? job.Requirements.join("\n")
        : job.Requirements}

    TAGS:
    ${job.Tags?.join(", ") || ""}
    `;
}

export function formatCV(cv: any): string {
  return `
    CANDIDATE TITLE:
    ${cv.title}

    SUMMARY:
    ${cv.summary || ""}

    SKILLS:
    ${cv.skills
        ?.map((s: any) => `- ${s.skillName} (${s.level || "N/A"})`)
        .join("\n")}

    EXPERIENCE:
    ${cv.experience
        ?.map(
        (e: any) => `
            ${e.companyName} - ${e.position}
            ${e.description || ""}
    `
        )
        .join("\n")}

    PROJECTS:
    ${cv.projects
        ?.map(
        (p: any) => `
            ${p.projectName}
    Role: ${p.role}
    Tech: ${p.technologies?.join(", ")}
    `
        )
        .join("\n")}
    `;
}
import type { iResumeDetail } from "../types/resume";
import api from "./api";

export const CreateResume = async (resumeData: iResumeDetail) => {
    const response = await api.post('/resumes/build', resumeData);
    return response.data;
}
import mongoose, { Schema, Document } from 'mongoose';
import { iResumeDetail } from '../interface/resume';

const ResumeDetailSchema: Schema = new Schema({
    candidateId: { type: Number, required: true, index: true }, 
    title: { type: String, required: true },
    summary: { type: String },
    
    skills: [{ 
        skillId: { type: Number },
        skillName: { type: String, required: true },
        level: { type: String }
    }], 
    
    experience: [{
        companyName: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        isCurrent: { type: Boolean, default: false },
        description: { type: String }
    }],
    
    education: [{
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        major: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        gpa: { type: String }
    }],
    
    projects: [{
        projectName: { type: String, required: true },
        role: { type: String, required: true },
        technologies: [{ type: String }],
        link: { type: String },
        description: { type: String }
    }]
}, {
    timestamps: true
});

export default mongoose.model<iResumeDetail>('ResumeDetail', ResumeDetailSchema);
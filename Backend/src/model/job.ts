import mongoose from "mongoose";
const jobDetail = new mongoose.Schema({
    mysqlJobID: { type: Number, required: true, index: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    workingSchedule: { type: String },

    benefits: [{ type: String, required: true }],
    tags: [{ type: String, required: true }],
    interviewProcess: [{
        roundOrder: { type: Number },
        roundTitle: { type: String },
        details: { type: String }
    }],
    rowTextForAi: { type: String }
}, { timestamps: true });

export const JobDetailModel = mongoose.model("JobDetail", jobDetail);

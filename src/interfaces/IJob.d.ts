import mongoose, {Document, Schema} from "mongoose";

// IJob.d.ts
export interface IJob extends Document {
    title: string;
    description: string; // 500 chars max
    skills: string[];
    type: "full-time" | "freelance" | "internship";
    location: "remote" | "onsite";
    salaryRange?: string;
    postedBy: mongoose.Schema.Types.ObjectId; // Ref to Recruiter
    createdAt: Date;
}
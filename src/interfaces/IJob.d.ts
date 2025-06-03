import mongoose, {Document, Schema} from "mongoose";

// IJob.d.ts
export interface IJob extends Document {
    title: string;
    description: string; // 500 chars max
    skills: string[];
    type: "full-time" | "freelance" | "internship";
    requirements: string[]; // Array of requirements
    location: "remote" | "onsite";
    salaryRange?: string;
    status: "open" | "closed";
    companyName: string;
    applicants: mongoose.Schema.Types.ObjectId[]; // Ref to Users
    postedBy: mongoose.Schema.Types.ObjectId;
    interviews:{
        studentId: mongoose.Schema.Types.ObjectId; 
        startTime: Date;
        endTime: Date;
        status: "scheduled" | "completed" | "canceled";
    }
    createdAt: Date;
}
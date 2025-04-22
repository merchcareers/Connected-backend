import { IJob } from "../interfaces/IJob";
import mongoose, {Schema, Document} from "mongoose";

const JobSchema: Schema<IJob> = new Schema({
    title: { type: String, required: true },
    description: { type: String, maxlength: 500, required: true },
    skills: [{ type: String }],
    type: { type: String, enum: ["full-time", "freelance", "internship"], required: true },
    requirements: [{ type: String }],
    location: { type: String, enum: ["remote", "onsite"], required: true },
    salaryRange: { type: String },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    applicants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Job = mongoose.model<IJob>("Job", JobSchema);
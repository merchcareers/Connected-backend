import { IJob } from "../interfaces/IJob";
import mongoose, {Schema, Document} from "mongoose";

const JobSchema: Schema<IJob> = new Schema({
    title: { type: String, required: true },
    description: { type: String, maxlength: 500, required: true },
    skills: [{ type: String }],
    type: { type: String, enum: ["full-time", "freelance", "internship"], required: true },
    location: { type: String, enum: ["remote", "onsite"], required: true },
    salaryRange: { type: String },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Job = mongoose.model<IJob>("Job", JobSchema);
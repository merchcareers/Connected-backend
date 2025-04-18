import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IStudent, IMentor, IRecruiter, IFreelancer } from "../interfaces/IUser";

// Base User Schema
const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        country: { type: String },
        phone: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: ["student", "mentor", "recruiter", "freelancer"],
            required: true,
        },
        bio: { type: String, maxlength: 200 },
        skills: [{ type: String }], // Array of skill tags
        avatar: { type: String },
        portfolio: { type: String },
        isEmailVerified: { type: Boolean, default: false },
        otp: { type: String }, // OTP for email verification
        otpExpires: { type: Date },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }, discriminatorKey: "role" }
);

// Student Schema
const StudentSchema: Schema<IStudent> = new Schema({
    experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
    },
    mentorshipRequests: [
        {
            mentorId: { type: Schema.Types.ObjectId, ref: "User" },
            status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    appliedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
});

// Mentor Schema
const MentorSchema: Schema<IMentor> = new Schema({
    availability: { type: String, required: true }, // e.g., "1 hr/week"
    experienceLevel: {
        type: String,
        enum: ["intermediate", "advanced", "expert"],
        required: true,
    },
    mentorships: [
        {
            studentId: { type: Schema.Types.ObjectId, ref: "User" },
            status: { type: String, enum: ["active", "completed"], default: "active" },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

// Recruiter Schema
const RecruiterSchema: Schema<IRecruiter> = new Schema({
    companyName: { type: String },
    postedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
});

// Freelancer Schema
const FreelancerSchema: Schema<IFreelancer> = new Schema({
    experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
    },
    appliedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
});

// Models
const User = mongoose.model<IUser>("User", UserSchema);
const Student = User.discriminator<IStudent>("student", StudentSchema);
const Mentor = User.discriminator<IMentor>("mentor", MentorSchema);
const Recruiter = User.discriminator<IRecruiter>("recruiter", RecruiterSchema);
const Freelancer = User.discriminator<IFreelancer>("freelancer", FreelancerSchema);

export { User, Student, Mentor, Recruiter, Freelancer };
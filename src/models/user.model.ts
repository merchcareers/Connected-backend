import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IStudent, IMentor, IRecruiter } from "../interfaces/IUser";

// Base User Schema
const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        country: { type: String },
        phone: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ["student", "mentor", "recruiter"], required: true },
        bio: { type: String, maxlength: 200 },
        avatar: { type: String },
        isEmailVerified: { type: Boolean, default: false },
        otp: { type: String },
        otpExpires: { type: Date },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        // New fields
        followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Users following this user
        connections: [{ type: Schema.Types.ObjectId, ref: "User" }], // Accepted connections
        connectionRequests: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User" },
                status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }, discriminatorKey: "role" }
);

// Student Schema
const StudentSchema: Schema<IStudent> = new Schema({
    skills: [{ type: String }],
    portfolio: { type: String },
    experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
    },
    projects: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            link: { type: String, required: true },
            status: { type: String, enum: ["active", "pending", "done"], default: "active" },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    schedule: [
        {
            mentorId: { type: Schema.Types.ObjectId, ref: "User" },
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true },
            title: { type: String, required: true },
            description: { type: String },
            status: { type: String, enum: ["scheduled", "completed", "canceled"], default: "scheduled" },
        },
    ],
    mentorshipRequests: [
        {
            mentorId: { type: Schema.Types.ObjectId, ref: "User" },
            status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    appliedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    // New fields
    resumes: [
        {
            fileUrl: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now },
            name: { type: String, required: true },
        },
    ],
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }], // Career events joined
    skillsRecommendations: [{ type: String }], // Recommended skills based on profile
    analytics: {
        applicationsSubmitted: { type: Number, default: 0 },
        interviewsScheduled: { type: Number, default: 0 },
        skillAssessmentsCompleted: { type: Number, default: 0 },
        offersReceived: { type: Number, default: 0 },
        mentorshipsCompleted: { type: Number, default: 0 },
        mentorshipProgress: { type: Number, default: 0 }, // Percentage progress
    },
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
    sessions: [
        {
            studentId: { type: Schema.Types.ObjectId, ref: "User" },
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true },
            title: { type: String, required: true },
            description: { type: String },
            status: { type: String, enum: ["scheduled", "completed", "canceled"], default: "scheduled" },
        },
    ],

    eventsCreated: [{ type: Schema.Types.ObjectId, ref: "Event" }], // Career events created by the mentor
    
});

// Recruiter Schema
const RecruiterSchema: Schema<IRecruiter> = new Schema({
    companyName: { type: String },
    postedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    interviews: [{
        studentId: { type: Schema.Types.ObjectId, ref: "User" },
        jobId: { type: Schema.Types.ObjectId, ref: "Job" },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        status: { type: String, enum: ["scheduled", "completed", "canceled"], default: "scheduled" },
        createdAt: { type: Date, default: Date.now },
    }]
});


// Models
const User = mongoose.model<IUser>("User", UserSchema);
const Student = User.discriminator<IStudent>("student", StudentSchema);
const Mentor = User.discriminator<IMentor>("mentor", MentorSchema);
const Recruiter = User.discriminator<IRecruiter>("recruiter", RecruiterSchema);

export { User, Student, Mentor, Recruiter };
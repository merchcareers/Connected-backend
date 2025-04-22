import mongoose, { Document, Schema } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

// Base user interface
export interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    username: string; // Unique username
    email: string;
    country?: string; // Optional field
    phone?: string; // Optional field
    password: string;
    role: "student" | "mentor" | "recruiter" | "freelancer";
    bio?: string; // Short description (200 chars max)
    skills: string[]; // Tags like "JavaScript", "Design"
    avatar?: string;
    portfolio?: string; // Optional URL (e.g., GitHub, Dribbble)
    isEmailVerified: boolean;
    otp: string; 
    otpExpires: Date | null;
    isActive: boolean;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// Student-specific fields
export interface IStudent extends IUser {
    experienceLevel: "beginner" | "intermediate" | "advanced";
    mentorshipRequests: {
        mentorId: mongoose.Schema.Types.ObjectId;
        status: "pending" | "accepted" | "declined";
        createdAt: Date;
    }[];
    appliedJobs: mongoose.Schema.Types.ObjectId[]; // Reference to Job model
}

// Mentor-specific fields
export interface IMentor extends IUser {
    availability: string; // e.g., "1 hr/week"
    experienceLevel: "intermediate" | "advanced" | "expert";
    mentorships: {
        studentId: mongoose.Schema.Types.ObjectId;
        status: "active" | "completed";
        createdAt: Date;
    }[];
}

// Recruiter-specific fields
export interface IRecruiter extends IUser {
    companyName?: string;
    postedJobs: mongoose.Schema.Types.ObjectId[]; // Reference to Job model
}
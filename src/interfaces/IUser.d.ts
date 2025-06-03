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
    username: string;
    email: string;
    country?: string;
    phone?: string;
    password: string;
    role: "student" | "mentor" | "recruiter" | "freelancer";
    bio?: string;
    avatar?: string;
    isEmailVerified: boolean;
    otp: string; 
    otpExpires: Date | null;
    isActive: boolean;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;

    followers?: mongoose.Schema.Types.ObjectId[]; // Users following this user
    connections?: mongoose.Schema.Types.ObjectId[]; // Accepted connections
    connectionRequests?: {
        userId: mongoose.Schema.Types.ObjectId;
        status: "pending" | "accepted" | "declined";
        createdAt: Date;
    }[];
}

// Student-specific fields
export interface IStudent extends IUser {
    skills: string[];
    experienceLevel: "beginner" | "intermediate" | "advanced";
    portfolio?: string; 
    projects?: {
        title: string;
        description: string;
        link: string;
        status: "active" | "pending" | "done";
        createdAt: Date;

    };
    schedule: {
        mentorId: mongoose.Schema.Types.ObjectId;
        startTime: Date;
        endTime: Date;
        title: string;
        description?: string;
        status: "scheduled" | "completed" | "cancelled";
        createdAt: Date;
    }
    mentorshipRequests: {
        mentorId: mongoose.Schema.Types.ObjectId;
        status: "pending" | "accepted" | "declined";
        createdAt: Date;
    }[];
    appliedJobs: mongoose.Schema.Types.ObjectId[];
    savedJobs: mongoose.Schema.Types.ObjectId[];
    resumes?: {
        fileUrl: string;
        createdAt: Date;
    }[];
    events: mongoose.Schema.Types.ObjectId[];
    skillsRecommendations?: string[];
    analytics: {
        applicationsSubmitted: number;
        interviewsScheduled: number;
        skillsAssessmentsCompleted: number;
        offersReceived: number;
        mentorshipsCompleted: number;
        mentorshipProgress: number;
    }

}

export interface IMentor extends IUser {
    availability: string; 
    experienceLevel: "intermediate" | "advanced" | "expert";
    mentorships: {
        studentId: mongoose.Schema.Types.ObjectId;
        status: "active" | "completed";
        createdAt: Date;
    }[];
    sessions: {
        studentId: mongoose.Schema.Types.ObjectId;
        startTime: Date;
        endTime: Date;
        title: string;
        description?: string;
        status: "scheduled" | "completed" | "cancelled";
        createdAt: Date;
    },
    eventsCreated: mongoose.Schema.Types.ObjectId[];


}


export interface IRecruiter extends IUser {
    companyName?: string;
    postedJobs: mongoose.Schema.Types.ObjectId[];
    interviews: {
        studentId: mongoose.Schema.Types.ObjectId;
        jobId: mongoose.Schema.Types.ObjectId;
        scheduledAt: Date;
        status: "scheduled" | "completed" | "cancelled";
        createdAt: Date;
    }
}
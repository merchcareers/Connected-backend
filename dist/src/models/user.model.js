"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Freelancer = exports.Recruiter = exports.Mentor = exports.Student = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Base User Schema
const UserSchema = new mongoose_1.Schema({
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
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, discriminatorKey: "role" });
// Student Schema
const StudentSchema = new mongoose_1.Schema({
    experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
    },
    mentorshipRequests: [
        {
            mentorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
            status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    appliedJobs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Job" }],
});
// Mentor Schema
const MentorSchema = new mongoose_1.Schema({
    availability: { type: String, required: true }, // e.g., "1 hr/week"
    experienceLevel: {
        type: String,
        enum: ["intermediate", "advanced", "expert"],
        required: true,
    },
    mentorships: [
        {
            studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
            status: { type: String, enum: ["active", "completed"], default: "active" },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});
// Recruiter Schema
const RecruiterSchema = new mongoose_1.Schema({
    companyName: { type: String },
    postedJobs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Job" }],
});
// Freelancer Schema
const FreelancerSchema = new mongoose_1.Schema({
    experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
    },
    appliedJobs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Job" }],
});
// Models
const User = mongoose_1.default.model("User", UserSchema);
exports.User = User;
const Student = User.discriminator("student", StudentSchema);
exports.Student = Student;
const Mentor = User.discriminator("mentor", MentorSchema);
exports.Mentor = Mentor;
const Recruiter = User.discriminator("recruiter", RecruiterSchema);
exports.Recruiter = Recruiter;
const Freelancer = User.discriminator("freelancer", FreelancerSchema);
exports.Freelancer = Freelancer;

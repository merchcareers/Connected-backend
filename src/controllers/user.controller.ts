import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import catchAsync from "../errors/catchAsync";
import AppResponse from "../helpers/AppResponse";
import { Student, Mentor, Recruiter, User } from "../models/user.model"
import AppError from "../errors/AppError";
import { IUser, IMentor, IStudent, IRecruiter } from "../interfaces/IUser";
import { uploadMedia, deleteImage } from "../helpers/uploadAndDeleteImage";
import { handleStudentUpdate, handleMentorUpdate, handleRecruiterUpdate } from "../helpers/handleProfileUpdate";


export const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as IUser).id;
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    return AppResponse(res, "User profile retrieved successfully", 200, user);
});

export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as IUser).id;
        const user = await User.findById(userId);
        if (!user) return next(new AppError("User not found", 404));

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };
        const body = req.body;
        const updates: any = {};

    

        // COMMON FIELDS
        const commonFields = ["name", "username", "bio", "country", "phone"];
        for (const field of commonFields) {
            if (body[field]) updates[field] = body[field];
        }

        // AVATAR UPLOAD
        if (files?.avatar?.length) {
            const uploaded = await uploadMedia(files.avatar);
            updates.avatar = uploaded[0].imageUrl;

            if (user.avatar) {
                const oldKey = user.avatar.split('/').pop()?.split('.')[0];
                if (oldKey) await deleteImage([oldKey]);
            }
        }

        // ROLE-SPECIFIC LOGIC
        if (user.role === "student") {
            const student = await Student.findById(userId);
            if (!student) return next(new AppError("Student record not found", 404));

            if (body.skills) student.skills = Array.isArray(body.skills) ? body.skills : [body.skills];
            if (body.experienceLevel) student.experienceLevel = body.experienceLevel;
            if (body.portfolio) student.portfolio = body.portfolio;

            // RESUME UPLOAD
            if (files?.resumes?.length) {
                const uploaded = await uploadMedia(files.resumes);
                const newResumes = uploaded.map(u => ({
                    fileUrl: u.imageUrl,
                    createdAt: new Date(),
                }));
                student.resumes = student.resumes ? [...student.resumes, ...newResumes] : newResumes;
            }

            await student.save();
        }

        if (user.role === "mentor") {
            const mentor = await Mentor.findById(userId);
            if (!mentor) return next(new AppError("Mentor record not found", 404));

            if (body.availability) mentor.availability = body.availability;
            if (body.experienceLevel) mentor.experienceLevel = body.experienceLevel;
            await mentor.save();
        }

        if (user.role === "recruiter") {
            const recruiter = await Recruiter.findById(userId);
            if (!recruiter) return next(new AppError("Recruiter record not found", 404));

            if (body.companyName) recruiter.companyName = body.companyName;
            await recruiter.save();
        }

        // FINAL UPDATE ON BASE USER FIELDS
        if (Object.keys(updates).length > 0) {
            await User.findByIdAndUpdate(userId, updates, { new: true });
        }

        return AppResponse(res, "Profile updated successfully", 200);
    } catch (err: any) {
        console.error(" PROFILE UPDATE ERROR:", err);
        return next(new AppError(err.message || "Internal error", 500));
    }
});

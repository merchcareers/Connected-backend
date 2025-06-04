import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../errors/catchAsync";
import AppResponse from "../helpers/AppResponse";
import { Student, Mentor, Recruiter, User } from "../models/user.model"
import AppError from "../errors/AppError";
import { IUser } from "../interfaces/IUser";
import { deleteImage } from "../helpers/uploadAndDeleteImage";


export const deleteResume = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as IUser).id;
    const { resumeIndex } = req.params;

    const student = await Student.findById(userId);
    if (!student) {
        return next(new AppError("Student not found", 404));
    }

    const resumeIdx = parseInt(resumeIndex);
    if (isNaN(resumeIdx) || !student.resumes || resumeIdx >= student.resumes.length) {
        return next(new AppError("Invalid resume index", 400));
    }

    const resumeToDelete = student.resumes[resumeIdx];

    try {
        // Extract key from URL and delete from Cloudinary
        const resumeKey = resumeToDelete.fileUrl.split('/').pop()?.split('.')[0];
        if (resumeKey) {
            await deleteImage([resumeKey]);
        }

        // Remove from database
        student.resumes.splice(resumeIdx, 1);
        await student.save();

        return AppResponse(res, "Resume deleted successfully", 200, null);
    } catch (error) {
        console.error("Resume deletion error:", error);
        return next(new AppError("Failed to delete resume", 500));
    }
});

export const addProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as IUser).id;
    const { title, description, link, status = 'active' } = req.body;

    if (!title || !description || !link) {
        return next(new AppError("Title, description, and link are required", 400));
    }

    const student = await Student.findById(userId);
    if (!student) {
        return next(new AppError("Student not found", 404));
    }

    const newProject = {
        title,
        description,
        link,
        status,
        createdAt: new Date()
    };

    if (!student.projects) {
        student.projects = [];
    }

    student.projects.push(newProject);
    await student.save();

    return AppResponse(res, "Project added successfully", 201, newProject);
});

export const updateProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as IUser).id;
    const { projectIndex } = req.params;
    const updates = req.body;

    const student = await Student.findById(userId);
    if (!student) {
        return next(new AppError("Student not found", 404));
    }

    const projectIdx = parseInt(projectIndex);
    if (isNaN(projectIdx) || !student.projects || projectIdx >= student.projects.length) {
        return next(new AppError("Invalid project index", 400));
    }

    // Update project fields
    Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined && key !== '_id') {
            (student.projects![projectIdx] as any)[key] = updates[key];
        }
    });

    await student.save();

    return AppResponse(res, "Project updated successfully", 200, student.projects[projectIdx]);
});

export const deleteProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as IUser).id;
    const { projectIndex } = req.params;

    const student = await Student.findById(userId);
    if (!student) {
        return next(new AppError("Student not found", 404));
    }

    const projectIdx = parseInt(projectIndex);
    if (isNaN(projectIdx) || !student.projects || projectIdx >= student.projects.length) {
        return next(new AppError("Invalid project index", 400));
    }

    student.projects.splice(projectIdx, 1);
    await student.save();

    return AppResponse(res, "Project deleted successfully", 200, null);
});

export const getProjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as IUser).id;

    const student = await Student.findById(userId).select('projects');
    if (!student) {
        return next(new AppError("Student not found", 404));
    }
    if (!student.projects || student.projects.length === 0) {
        return AppResponse(res, "No projects found", 200, []);
    }
    return AppResponse(res, "Projects retrieved successfully", 200, student.projects);
})
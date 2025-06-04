import { Request, Response, NextFunction } from "express";
import { IMentor, IStudent, IRecruiter } from "../interfaces/IUser";
import { uploadMedia } from "./uploadAndDeleteImage";
import { Student, Recruiter, Mentor, User } from "../models/user.model";

const handleStudentUpdate = async (
    req: Request,
    roleSpecificData: any,
    files: { [fieldname: string]: Express.Multer.File[] } | undefined,
    user: IStudent
) => {
    const parseField = (field: any) => {
        if (typeof field === 'string') {
            try {
                const parsed = JSON.parse(field);
                console.log(`Parsed ${field}:`, parsed);
                return parsed;
            } catch (error) {
                console.error(`Failed to parse ${field}:`, error);
                return field;
            }
        }
        return field;
    };

    // Handle array fields
    if (req.body.skills) {
        roleSpecificData.skills = parseField(req.body.skills);
    }

    if (req.body.skillsRecommendations) {
        roleSpecificData.skillsRecommendations = parseField(req.body.skillsRecommendations);
    }

    // Handle simple fields
    const studentFields = ['portfolio', 'experienceLevel'];
    for (const field of studentFields) {
        if (req.body[field] !== undefined) {
            roleSpecificData[field] = req.body[field];
        }
    }

    // Handle educational background
    if (req.body.educationalBackground) {
        const educationalData = parseField(req.body.educationalBackground);
        if (Array.isArray(educationalData)) {
            roleSpecificData.educationalBackground = educationalData.map((edu: any) => ({
                ...edu,
                startDate: new Date(edu.startDate),
                endDate: edu.endDate ? new Date(edu.endDate) : undefined
            }));
        }
    }

    // Handle projects
    if (req.body.projects) {
        const projectsData = parseField(req.body.projects);
        if (Array.isArray(projectsData)) {
            roleSpecificData.projects = projectsData.map((project: any) => ({
                ...project,
                createdAt: project.createdAt ? new Date(project.createdAt) : new Date()
            }));
        }
    }

    // Handle resume upload
    if (files?.resume && files.resume.length > 0) {
        try {
            const uploadResults = await uploadMedia(files.resume);
            const newResumes = uploadResults.map((result, index) => ({
                fileUrl: result.imageUrl,
                uploadedAt: new Date(),
                name: files.resume![index].originalname
            }));

            // Add to existing resumes or create new array
            if (user.resumes && user.resumes.length > 0) {
                roleSpecificData.resumes = [...user.resumes, ...newResumes];
            } else {
                roleSpecificData.resumes = newResumes;
            }
        } catch (error) {
            console.error("Resume upload error:", error);
            throw new Error("Failed to upload resume files");
        }
    }

    // Handle analytics update
    if (req.body.analytics) {
        const analyticsData = parseField(req.body.analytics);
        if (typeof analyticsData === 'object') {
            roleSpecificData.analytics = {
                ...user.analytics,
                ...analyticsData
            };
        }
    }
};

// Helper function for mentor-specific updates
const handleMentorUpdate = async (req: Request, roleSpecificData: any, user: IMentor) => {
    const parseField = (field: any) => {
        if (typeof field === 'string') {
            try {
                return JSON.parse(field);
            } catch {
                return field;
            }
        }
        return field;
    };

    // Handle simple fields
    const mentorFields = ['availability', 'experienceLevel'];
    for (const field of mentorFields) {
        if (req.body[field] !== undefined) {
            roleSpecificData[field] = req.body[field];
        }
    }

    // Handle mentorships array
    if (req.body.mentorships) {
        const mentorshipsData = parseField(req.body.mentorships);
        if (Array.isArray(mentorshipsData)) {
            roleSpecificData.mentorships = mentorshipsData.map((mentorship: any) => ({
                ...mentorship,
                createdAt: mentorship.createdAt ? new Date(mentorship.createdAt) : new Date()
            }));
        }
    }

    // Handle sessions array
    if (req.body.sessions) {
        const sessionsData = parseField(req.body.sessions);
        if (Array.isArray(sessionsData)) {
            roleSpecificData.sessions = sessionsData.map((session: any) => ({
                ...session,
                startTime: new Date(session.startTime),
                endTime: new Date(session.endTime),
                createdAt: session.createdAt ? new Date(session.createdAt) : new Date()
            }));
        }
    }
};

// Helper function for recruiter-specific updates
const handleRecruiterUpdate = async (req: Request, roleSpecificData: any, user: IRecruiter) => {
    const parseField = (field: any) => {
        if (typeof field === 'string') {
            try {
                return JSON.parse(field);
            } catch {
                return field;
            }
        }
        return field;
    };

    // Handle simple fields
    if (req.body.companyName !== undefined) {
        roleSpecificData.companyName = req.body.companyName;
    }

    // Handle interviews array
    if (req.body.interviews) {
        const interviewsData = parseField(req.body.interviews);
        if (Array.isArray(interviewsData)) {
            roleSpecificData.interviews = interviewsData.map((interview: any) => ({
                ...interview,
                startTime: new Date(interview.startTime),
                endTime: new Date(interview.endTime),
                createdAt: interview.createdAt ? new Date(interview.createdAt) : new Date()
            }));
        }
    }
};

const updateUserByRole = async (
    userId: string,
    role: string,
    updateData: any
): Promise<void> => {
    switch (role) {
        case 'student':
            await Student.findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true
            });
            break;
        case 'mentor':
            await Mentor.findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true
            });
            break;
        case 'recruiter':
            await Recruiter.findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true
            });
            break;
        default:
            await User.findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true
            });
    }
};

export {
    handleStudentUpdate,
    handleMentorUpdate,
    handleRecruiterUpdate,
    updateUserByRole
}
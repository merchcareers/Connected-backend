import { Request, Response, NextFunction } from "express";
import catchAsync from "../errors/catchAsync";
import AppResponse from "../helpers/AppResponse";
import AppError from "../errors/AppError";
import { Job } from "../models/jobs.model";
import { Student } from "../models/user.model";
import { IUser } from "../interfaces/IUser";
import { IStudent } from "../interfaces/IUser";
import { Activity } from "../models/mentorship.model";


// Get all jobs

export const getAllJobs = catchAsync(async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const jobs = await Job.find().populate("postedBy", "name email");
    if (!jobs) {
        return next(new AppError("No jobs found", 404));
    }

    return AppResponse(res, "Jobs fetched successfully")
  
});

export const applyJobHandler = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

    const userId = (req.user as IUser)._id;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) return next(new AppError("Job not found", 404));
    if (job.status !== "open") return next(new AppError("Job is closed", 400));
    if (job.applicants.includes(userId)) return next(new AppError("You have already applied", 400));

    job.applicants.push(userId);
    await job.save();

    await Student.findByIdAndUpdate(userId, { $addToSet: { appliedJobs: jobId } });

    // Log activity
    const activity = new Activity({
        userId,
        actionType: "job_application",
        description: `Applied for ${job.title} at ${job.companyName}`,
    });
    await activity.save();

})
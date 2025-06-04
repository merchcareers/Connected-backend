import express from "express";
import validate from "../middleware/validateZod";
import CheckRole from "../middleware/checkRole";
import { upload } from "../config/multer.config";
import VerifyAccessToken, { VerifyTrackingToken } from "../middleware/verifyAccessToken";

import Limiter from "../middleware/rateLimit";

import { getUserProfile, updateProfile } from "../controllers/user.controller";
import { deleteResume, addProject, updateProject, deleteProject, getProjects } from "../controllers/student.controller";



const router = express.Router();

router.get('/profile', VerifyAccessToken, Limiter, getUserProfile);

router.put(
    '/profile',
    VerifyAccessToken,
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'resumes', maxCount: 3 },
    ]),
    updateProfile
  );







  
router.delete('/profile/resume/:resumeIndex', VerifyAccessToken, deleteResume);

// Project management routes (for students)
router.post('/profile/projects', VerifyAccessToken, addProject);
router.put('/profile/projects/:projectIndex', VerifyAccessToken, updateProject);
router.delete('/profile/projects/:projectIndex', VerifyAccessToken, deleteProject);
router.get('/profile/projects', VerifyAccessToken, getProjects);





export default router;


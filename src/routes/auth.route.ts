import express from "express";
import validate from "../middleware/validateZod";
import CheckRole from "../middleware/checkRole";
import { CreateOtpSchema, loginSchema, twoFASchema, registerSchema, verifyEmailOtpSchema, verifyOtpSchema, forgotPasswordSchema, changePasswordSchema, resetPasswordSchema } from "../validations/authValidation";
import { registerHandler, loginHandler, logOutHandler, GetTokenDetailsHandler, refreshAccessTokenHandler, verifyEmailHandler,  resendVerificationEmail, resetPasswordHandler, forgotPasswordHandler, changePasswordHandler } from "../controllers/auth.controller";
import VerifyAccessToken, { VerifyTrackingToken } from "../middleware/verifyAccessToken";
import Limiter from "../middleware/rateLimit";

const router = express.Router();

router.post("/register", Limiter, validate(registerSchema), registerHandler);
router.post("/resend-verification", Limiter, resendVerificationEmail);
router.patch("/verify-email", Limiter, validate(verifyEmailOtpSchema), verifyEmailHandler);
router.post("/login", Limiter, validate(loginSchema), loginHandler); // Changed to POST for consistency
router.put("/logout", logOutHandler);
router.get("/confirm-access-token", Limiter, VerifyAccessToken, GetTokenDetailsHandler);
router.get("/refresh-access-token", Limiter, refreshAccessTokenHandler);
router.post("/forgot-password", Limiter, validate(forgotPasswordSchema), forgotPasswordHandler);
router.patch("/reset-password", Limiter, validate(resetPasswordSchema), resetPasswordHandler);
router.patch(
    "/change-password",
    Limiter,
    VerifyAccessToken,
    validate(changePasswordSchema),
    changePasswordHandler
);






export default router;


// Only mentors can access this route
// router.get("/mentors-only", VerifyAccessToken, CheckRole("mentor"), (req, res) => {
//     res.json({ message: "Welcome, mentor!" });
// });
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateZod_1 = __importDefault(require("../middleware/validateZod"));
const authValidation_1 = require("../validations/authValidation");
const auth_controller_1 = require("../controllers/auth.controller");
const verifyAccessToken_1 = __importDefault(require("../middleware/verifyAccessToken"));
const rateLimit_1 = __importDefault(require("../middleware/rateLimit"));
const router = express_1.default.Router();
router.post("/register", rateLimit_1.default, (0, validateZod_1.default)(authValidation_1.registerSchema), auth_controller_1.registerHandler);
router.post("/resend-verification", rateLimit_1.default, auth_controller_1.resendVerificationEmail);
router.patch("/verify-email", rateLimit_1.default, (0, validateZod_1.default)(authValidation_1.verifyEmailOtpSchema), auth_controller_1.verifyEmailHandler);
router.post("/login", rateLimit_1.default, (0, validateZod_1.default)(authValidation_1.loginSchema), auth_controller_1.loginHandler); // Changed to POST for consistency
router.put("/logout", auth_controller_1.logOutHandler);
router.get("/confirm-access-token", rateLimit_1.default, verifyAccessToken_1.default, auth_controller_1.GetTokenDetailsHandler);
router.get("/refresh-access-token", rateLimit_1.default, auth_controller_1.refreshAccessTokenHandler);
router.post("/forgot-password", rateLimit_1.default, (0, validateZod_1.default)(authValidation_1.forgotPasswordSchema), auth_controller_1.forgotPasswordHandler);
router.patch("/reset-password", rateLimit_1.default, (0, validateZod_1.default)(authValidation_1.resetPasswordSchema), auth_controller_1.resetPasswordHandler);
router.patch("/change-password", rateLimit_1.default, verifyAccessToken_1.default, (0, validateZod_1.default)(authValidation_1.changePasswordSchema), auth_controller_1.changePasswordHandler);
exports.default = router;
// Only mentors can access this route
// router.get("/mentors-only", VerifyAccessToken, CheckRole("mentor"), (req, res) => {
//     res.json({ message: "Welcome, mentor!" });
// });

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTokenDetailsHandler = exports.refreshAccessTokenHandler = exports.logOutHandler = exports.verifyEmailHandler = exports.ResetPasswordHandler = exports.ChangePasswordHandler = exports.loginHandler = exports.resendVerificationEmail = exports.registerHandler = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../errors/catchAsync"));
const AppResponse_1 = __importDefault(require("../helpers/AppResponse"));
const user_model_1 = require("../models/user.model");
const AppError_1 = __importDefault(require("../errors/AppError"));
const nodemailer_config_1 = __importDefault(require("../config/nodemailer.config"));
const GenerateToken_1 = require("../helpers/GenerateToken");
const serviceUrl_1 = require("../serviceUrl");
const GenerateRandomId_1 = require("../helpers/GenerateRandomId");
// Register Handler
exports.registerHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, name, username, email, password, country, phone } = req.body;
        const userExists = yield user_model_1.User.findOne({ email, username });
        if (userExists) {
            return next(new AppError_1.default("User already exists", 400));
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        let user;
        switch (role) {
            case "student":
                user = new user_model_1.Student({ name, email, username, role, password: hashedPassword, experienceLevel: "beginner" });
                break;
            case "mentor":
                user = new user_model_1.Mentor({ name, email, username, role, password: hashedPassword, availability: "1 hr/week", experienceLevel: "intermediate" });
                break;
            case "recruiter":
                user = new user_model_1.Recruiter({ name, email, username, role, password: hashedPassword });
                break;
            case "freelancer":
                user = new user_model_1.Freelancer({ name, email, username, role, password: hashedPassword, experienceLevel: "beginner" });
                break;
            default:
                return next(new AppError_1.default("Invalid role. Must be student, mentor, recruiter, or freelancer", 400));
        }
        const firstName = name.split(" ")[0];
        const otpCode = (0, GenerateRandomId_1.generateRandomAlphanumeric)();
        user.otp = otpCode;
        user.otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const mailOptions = {
            email,
            subject: "Verify Your Email Address",
            templateName: "verifyEmail",
            context: { name: firstName, otpCode },
        };
        yield user.save();
        const maxRetries = 3;
        let attempts = 0;
        let emailSent = false;
        while (attempts < maxRetries && !emailSent) {
            try {
                yield (0, nodemailer_config_1.default)(mailOptions);
                emailSent = true;
            }
            catch (error) {
                attempts++;
                console.error(`Attempt ${attempts} failed:`, error);
                if (attempts >= maxRetries) {
                    console.log(`Failed to send email to ${email} after ${maxRetries} attempts.`);
                }
            }
        }
        const account = { name, username, email, role, country, phone };
        return (0, AppResponse_1.default)(res, "Registration successful, please check email to verify.", 201, account);
    }
    catch (error) {
        console.error("Error during registration:", error);
        return next(new AppError_1.default("Registration failed", 500));
    }
}));
// Resend Verification Email
exports.resendVerificationEmail = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        return next(new AppError_1.default("No user found with this email", 404));
    if (user.isEmailVerified)
        return next(new AppError_1.default("User is already verified", 400));
    const firstName = user.name.split(" ")[0];
    const otpCode = (0, GenerateRandomId_1.generateRandomAlphanumeric)();
    const mailOptions = {
        email: user.email,
        subject: "Verify Your Email Address",
        templateName: "verifyEmail",
        context: { name: firstName, otpCode },
    };
    yield user.save();
    const maxRetries = 3;
    let attempts = 0;
    let emailSent = false;
    while (attempts < maxRetries && !emailSent) {
        try {
            yield (0, nodemailer_config_1.default)(mailOptions);
            emailSent = true;
        }
        catch (error) {
            attempts++;
            console.error(`Attempt ${attempts} failed:`, error);
            if (attempts >= maxRetries) {
                return next(new AppError_1.default("Failed to send verification email", 500));
            }
        }
    }
    return (0, AppResponse_1.default)(res, "Verification email resent successfully", 200, { email: user.email });
}));
// Login Handler
exports.loginHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isMobile = req.headers.mobilereqsender;
    const { phone_email_or_username, password } = req.body;
    // const user = await User.findOne({ email });
    const user = yield user_model_1.User.findOne({
        $or: [{ email: phone_email_or_username }, { phone_number: phone_email_or_username }, { username: phone_email_or_username }],
    })
        .select("+password")
        .populate("store");
    if (!user)
        return next(new AppError_1.default("User not found", 404));
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        return next(new AppError_1.default("Invalid credentials", 401));
    if (!user.isEmailVerified)
        return next(new AppError_1.default("Please verify your email before log in.", 401));
    // if (user.is_two_factor_enabled) {
    //     //We should send a token here to track that okay, this person has had their password stuff done
    //     const two_fa_track = {
    //         id: user._id,
    //         createdAt: Date.now(),
    //     };
    //     const two_fa_token = GenerateTrackingToken(two_fa_track);
    //     return AppResponse(
    //         res,
    //         "Please check your Authenticator app for your token.",
    //         200,
    //         two_fa_token
    //     );
    // }
    const account = {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        // phone_number: user.phone_number,
        role: user.role,
        // profile_image:user.imageUrl,
    };
    // remove password from the user object
    user.password = undefined;
    yield user_model_1.User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    const accessToken = (0, GenerateToken_1.GenerateAccessToken)(account);
    const refreshToken = (0, GenerateToken_1.GenerateRefreshToken)(account);
    //If it is mobile we send token in response
    if (isMobile)
        return (0, AppResponse_1.default)(res, "Login successful", 200, {
            accessToken: accessToken,
            refreshToken: refreshToken,
            account: user,
        });
    res.cookie("e_access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        partitioned: true,
        priority: "high",
        signed: true,
        maxAge: 60 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });
    res.cookie("e_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        partitioned: true,
        signed: true,
        priority: "high",
        maxAge: 60 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });
    return (0, AppResponse_1.default)(res, "Login successful", 200, {
        accessToken: accessToken,
        refreshToken: refreshToken,
        account: user,
    });
}));
// export const loginHandler = catchAsync(
//     async (req: Request, res: Response, next: NextFunction) => {
//         const { phone_or_email, password } = req.body;
//         const user = await User.findOne({
//             $or: [{ email: phone_or_email }, { phone_number: phone_or_email }],
//         }).select("+password");
//         if (!user) return next(new AppError("User not found", 404));
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return next(new AppError("Invalid credentials", 401));
//         if (!user.isEmailVerified) return next(new AppError("Please verify your email", 401));
//         const account = { id: user._id, name: user.name, email: user.email, role: user.role };
//         user.password = undefined;
//         await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
//         const accessToken = GenerateAccessToken(account);
//         const refreshToken = GenerateRefreshToken(account);
//         res.cookie("e_access_token", accessToken, {
//             httpOnly: true,
//             secure: NODE_ENV === "production",
//             sameSite: "none",
//             partitioned: true,
//             priority: "high",
//             signed: true,
//             maxAge: 60 * 24 * 60 * 60 * 1000,
//             expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
//         });
//         res.cookie("e_refresh_token", refreshToken, {
//             httpOnly: true,
//             secure: NODE_ENV === "production",
//             sameSite: "none",
//             partitioned: true,
//             signed: true,
//             priority: "high",
//             maxAge: 60 * 24 * 60 * 60 * 1000,
//             expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
//         });
//         return AppResponse(res, "Login successful", 200, { accessToken, refreshToken, account });
//     }
// );
// Change Password Handler
exports.ChangePasswordHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        return next(new AppError_1.default("User not found", 404));
    if (!user.isEmailVerified)
        return next(new AppError_1.default("Unverified email", 401));
    const firstName = user.name.split(" ")[0];
    const otpCode = (0, GenerateRandomId_1.generateRandomAlphanumeric)();
    const mailOptions = {
        email,
        subject: "Confirm Your OTP",
        templateName: "resetPassword",
        context: { name: firstName, otpCode },
    };
    yield user.save();
    try {
        yield (0, nodemailer_config_1.default)(mailOptions);
    }
    catch (error) {
        console.error(`Error sending email to ${email}:`, error);
    }
    return (0, AppResponse_1.default)(res, "OTP sent to your email.", 200, { email });
}));
// Reset Password Handler
exports.ResetPasswordHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const id = req.user._id;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
    if (!updatedUser)
        return next(new AppError_1.default("User not found", 404));
    return (0, AppResponse_1.default)(res, "Password reset successfully.", 200, null);
}));
exports.verifyEmailHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, email } = req.body;
        const findUser = yield user_model_1.User.findOne({ email })
            .select("+password");
        if (!findUser) {
            return next(new AppError_1.default("User not found", 404));
        }
        const userDate = findUser.otpExpires;
        const dateToCheck = userDate ? new Date(userDate) : new Date(0);
        const now = new Date();
        if (findUser.otp === otp) {
            if (findUser.isEmailVerified) {
                return next(new AppError_1.default("This user has already verified their account.", 400));
            }
            // Check if current time is past the expiration time
            if (now > dateToCheck) {
                return next(new AppError_1.default("This OTP has expired. Please request a new one.", 400));
            }
            else {
                findUser.isEmailVerified = true;
                findUser.otp = "";
                findUser.otpExpires = null;
                yield findUser.save();
                // Send welcome email
                yield (0, nodemailer_config_1.default)({
                    email: findUser.email,
                    subject: "Welcome to connectED!",
                    templateName: "welcome",
                    context: { name: findUser.name || "User" }, // Use name if available
                }).catch((error) => console.error("Failed to send welcome email:", error));
                // Send push notification
                // if (findUser.fcm_token) {
                //     const message: admin.messaging.Message = {
                //         notification: {
                //             title: "Welcome to Arennah!",
                //             body: "Thank you for joining us!",
                //         },
                //         token: findUser.fcm_token,
                //     };
                //     await admin.messaging().send(message).catch((error: Error) =>
                //         console.error("Failed to send push notification:", error)
                //     );
                // }
                //remove password from the user object
                findUser.password = undefined;
                const account = {
                    id: findUser._id,
                    username: findUser.username,
                    name: findUser.name,
                    email: findUser.email,
                    role: findUser.role,
                };
                const accessToken = (0, GenerateToken_1.GenerateAccessToken)(account);
                const refreshToken = (0, GenerateToken_1.GenerateRefreshToken)(account);
                return (0, AppResponse_1.default)(res, "User verification successful.", 200, {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    account: findUser,
                });
            }
        }
        // Add this line to handle invalid OTP
        return next(new AppError_1.default("Invalid OTP code", 400));
    }
    catch (error) {
        console.error("Error during email verification:", error);
        return next(new AppError_1.default("Email verification failed", 500));
    }
}));
//Completed
exports.logOutHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //If Web
    res.clearCookie("e_access_token");
    res.clearCookie("e_refresh_token");
    //If mobile, just tell them to delete on their storage
    //   await addTokenToBlacklist(token);
    return (0, AppResponse_1.default)(res, "User has Log out successfully", 200, null);
}));
exports.refreshAccessTokenHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return next(new AppError_1.default("No authorization header provided", 401));
    }
    const refreshToken = req.headers.authorization.split(" ")[1];
    if (!refreshToken)
        return next(new AppError_1.default("No refresh token provided", 401));
    jsonwebtoken_1.default.verify(refreshToken, serviceUrl_1.RefreshToken_Secret_Key, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return next(new AppError_1.default("Incorrect or expired refresh token, please log in.", 401));
        const id = decoded.payload.id;
        const findUser = yield user_model_1.User.findById(id).select("-password");
        if (!findUser)
            return next(new AppError_1.default("Access token not created, only users can create them.", 400));
        const account = {
            id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            role: findUser.role,
        };
        const accessToken = (0, GenerateToken_1.GenerateAccessToken)(account);
        return (0, AppResponse_1.default)(res, "Token refreshed succesfully.", 200, {
            token: accessToken,
            account,
        });
    }));
}));
//Completed
exports.GetTokenDetailsHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Logic for refreshing the access Token goes here
    const id = req.user.id;
    const findUser = yield user_model_1.User.findById(id);
    if (!findUser)
        return next(new AppError_1.default("Invalid user, please go off.", 400));
    const account = {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
    };
    return (0, AppResponse_1.default)(res, "Successfully verified the token", 200, account);
}));

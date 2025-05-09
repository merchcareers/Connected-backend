//All validation for auth to be done here
import { z } from "zod";
export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be atleast 3 characters long"),
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be atleast 3 characters long")
    .max(20, "Username must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .refine((val) => !val.startsWith("_"), {
      message: "Username cannot start with an underscore",
    }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one digit",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must contain at least one special character.",
    }),
  role: z
    .enum(["student", "mentor", "recruiter", "freelancer"], { required_error: "Role is required" })
    .refine((value) => ["student", "mentor", "recruiter", "freelancer"].includes(value), {
      message: "Account type must be either 'student', 'freelancer', 'mentor', or 'recruiter'.",
    }),
});
export const verifyEmailOtpSchema = z.object({
  otp: z
    .string({ required_error: "OTP is required" })
    .min(6, "OTP must not be less than six characters")
    .max(6, "OTP must not exceed six characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
});

export const VerifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(6, "OTP must be 6 characters").max(6, "OTP must be 6 characters"),
  }),
});


export const loginSchema = z.object({
  username_or_email: z
    .string({ required_error: "Email or Username is required" })
    .min(3, "Username or Email must be at least 3 characters long")
    .max(20, "Username or Email must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9_@.]+$/, "Username or Email can only contain letters, numbers, and underscores"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one digit",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must contain at least one special character.",
    }),
});

export const CreateOtpSchema = z.object({
  phone_number: z
    .string({ required_error: "Phone number is required" })
    .min(8, "Phone number must be at least 8 characters long")
    .refine((val) => /^234\d{10,}$/.test(val), {
      message:
        "Phone number must start with '234' and be followed by at least 10 digits",
    }),
});
export const verifyOtpSchema = z.object({
  otp: z
    .string({ required_error: "OTP is required" })
    .min(4, "OTP must not be less than four characters")
    .max(4, "OTP must not exceed four characters"),
});
export const twoFASchema = z.object({
  two_factor_code: z
    .string({ required_error: "OTP is required" })
    .min(4, "OTP must not be less than four characters")
    .max(9, "OTP must not exceed nine characters"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
});

export const resetPasswordSchema = z.object({

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  otp: z
    .string({ required_error: "OTP is required" })
    .min(6, "OTP must not be less than six characters"),
  newPassword: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one digit",
    })

});

export const changePasswordSchema = z.object({

  currentPassword: z
    .string().min(6, "Current password must be at least 6 characters"),
  newPassword: z
    .string().min(6, "New password must be at least 6 characters"),
    
});
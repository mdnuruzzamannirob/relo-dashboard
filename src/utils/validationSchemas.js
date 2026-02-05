import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Forgot Password schema
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

// Verify OTP schema
export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .min(6, "OTP is required")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

// Reset Password schema
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Resend OTP schema
export const resendOtpSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

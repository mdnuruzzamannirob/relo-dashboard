import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { baseQueryWithReauth } from "../baseQuery";
import { clearUser, setUser } from "../slices/userSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/admin-login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;

          // Store token securely
          if (data.token) {
            localStorage.setItem("authToken", data.token);
          } else {
            throw new Error("No token received from server");
          }

          // Set user data in Redux
          if (data?.userData) {
            dispatch(setUser(data.userData));
          }

          toast.success("Sign in successful!");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message ||
            error?.message ||
            "Something went wrong";
          toast.error(errorMessage);

          // Ensure any failed login clears auth
          dispatch(clearUser());
          localStorage.removeItem("authToken");
        }
      },
      invalidatesTags: ["User"],
    }),

    // Get Current User
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          // Token is invalid, clear auth state
          dispatch(clearUser());
          localStorage.removeItem("authToken");
          sessionStorage.clear();
          dispatch(authApi.util.resetApiState());
        }
      },
      providesTags: ["User"],
    }),

    // Forgot Password - Send OTP
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          sessionStorage.setItem("forgotPasswordEmail", args.email);

          toast.success("OTP sent to your email");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message || "Failed to send OTP";
          toast.error(errorMessage);
        }
      },
    }),

    resendOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          sessionStorage.setItem("forgotPasswordEmail", args.email);

          toast.success("OTP resent to your email");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message || "Failed to resend OTP";
          toast.error(errorMessage);
        }
      },
    }),

    // Verify OTP
    verifyOTP: builder.mutation({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (!data?.success) {
            throw new Error("Invalid OTP. Please try again.");
          }

          sessionStorage.setItem("resetPasswordEmail", args?.email);
          sessionStorage.setItem("resetPasswordOTP", args?.verificationCode);

          toast.success("OTP verified successfully");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message || "OTP verification failed";
          toast.error(errorMessage);
        }
      },
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;

          sessionStorage.removeItem("forgotPasswordEmail");
          sessionStorage.removeItem("resetPasswordEmail");
          sessionStorage.removeItem("resetPasswordOTP");

          toast.success("Password reset successfully");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message || "Password reset failed";
          toast.error(errorMessage);
        }
      },
    }),

    // Change Password
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PUT",
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Password changed successfully!");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message || "Failed to change password";
          toast.error(errorMessage);
        }
      },
      invalidatesTags: ["User"],
    }),

    // Profile Image Upload
    profileImage: builder.mutation({
      query: (formData) => ({
        url: "/users/profile-image",
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setUser(data));
          toast.success("Profile image updated successfully!");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message || "Failed to update profile image";
          toast.error(errorMessage);
        }
      },
      invalidatesTags: ["User"],
    }),

    // Profile Update
    profileUpdate: builder.mutation({
      query: (formData) => ({
        url: "/users/profile-update",
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setUser(data));
          toast.success("Profile updated successfully!");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message || "Failed to update profile";
          toast.error(errorMessage);
        }
      },
      invalidatesTags: ["User"],
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Clear all auth-related state and storage
          dispatch(clearUser());
          localStorage.removeItem("authToken");
          sessionStorage.clear();

          // Clear user cache
          dispatch(authApi.util.resetApiState());

          toast.success("Logged out successfully");
        } catch (error) {
          // Even if logout fails on backend, clear local state
          dispatch(clearUser());
          localStorage.removeItem("authToken");
          sessionStorage.clear();
          dispatch(authApi.util.resetApiState());

          const errorMessage =
            error?.error?.data?.message || "Logged out successfully";
          toast.success(errorMessage);
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResendOtpMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useProfileImageMutation,
  useProfileUpdateMutation,
} = authApi;

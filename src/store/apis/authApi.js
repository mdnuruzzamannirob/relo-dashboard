import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { baseQuery } from "../baseQuery";
import { clearUser, setUser } from "../slices/authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
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

          if (data.token) {
            localStorage.setItem("authToken", data.token);
          }

          dispatch(setUser(data?.userData));

          toast.success("Sign in successful!");
        } catch (error) {
          const errorMessage =
            error?.error?.data?.message || "Something went wrong";
          toast.error(errorMessage);
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
        method: "POST",
        body,
      }),
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
} = authApi;

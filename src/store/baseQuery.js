import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authApi } from "./apis/authApi";
import { clearUser } from "./slices/userSlice";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://relo-ecommerce-backend.vercel.app/api/v1";

let logoutInProgress = false;

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    // Get token from localStorage dynamically
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    // Add authorization header if token exists
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized - token expired or invalid
  if (result.error?.status === 401) {
    // Prevent multiple logout attempts
    if (!logoutInProgress) {
      logoutInProgress = true;

      // Clear auth state
      api.dispatch(clearUser());

      // Clear storage
      localStorage.removeItem("authToken");
      sessionStorage.clear();

      // Reset API state
      api.dispatch(authApi.util.resetApiState());

      // Redirect to login (handled by AuthInitializer watching the state)
      logoutInProgress = false;
    }
  }

  // Handle other error statuses
  if (result.error?.status === 403) {
    // Forbidden - user doesn't have permission
    console.error(
      "Forbidden: You don't have permission to access this resource",
    );
  }

  if (result.error?.status === 500) {
    // Server error
    console.error("Server error: Please try again later");
  }

  return result;
};

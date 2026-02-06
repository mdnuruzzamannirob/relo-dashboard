import { useEffect } from "react";
import { clearUser, setIsLoading, setUser } from "@/store/slices/userSlice";
import { authApi } from "@/store/apis/authApi";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken");

      // No token → logout
      if (!token) {
        cleanup();
        return;
      }

      // Validate token exists and is not malformed
      if (!token.trim()) {
        cleanup();
        return;
      }

      // Check expiry
      try {
        const decoded = jwtDecode(token);

        // Check if token has required properties
        if (!decoded.exp) {
          cleanup();
          return;
        }

        // Check if token is expired (with 1 minute buffer before actual expiry)
        const now = Date.now();
        const expiryTime = decoded.exp * 1000;
        const bufferTime = 60000; // 1 minute

        if (expiryTime - bufferTime < now) {
          console.warn("Token expired, clearing auth");
          cleanup();
          return;
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        cleanup();
        return;
      }

      // Fetch user data from backend
      try {
        const result = await dispatch(
          authApi.endpoints.getMe.initiate(),
        ).unwrap();

        // Ensure user data exists
        if (!result) {
          cleanup();
          return;
        }

        dispatch(setIsLoading(false));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // If API fails, token is invalid or user is deleted
        cleanup();
      }
    };

    const cleanup = () => {
      dispatch(clearUser());
      localStorage.removeItem("authToken");
      sessionStorage.clear();
      dispatch(authApi.util.resetApiState());
      dispatch(setIsLoading(false));
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}

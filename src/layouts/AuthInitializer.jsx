import { useEffect } from "react";
import { clearUser, setIsLoading } from "@/store/slices/authSlice";
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

      // Check expiry
      try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          cleanup();
          return;
        }
      } catch {
        cleanup();
        return;
      }

      // Fetch user data from backend
      try {
        await dispatch(authApi.endpoints.getMe.initiate()).unwrap();
        dispatch(setIsLoading(false));
      } catch (error) {
        // If API fails, token is invalid
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

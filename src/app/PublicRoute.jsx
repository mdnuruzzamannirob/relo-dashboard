import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PublicRoute({ children }) {
  const { isLoading, isAuthenticated } = useAuth();

  // Still loading, show nothing or a placeholder
  if (isLoading) {
    return null;
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/overview" replace />;
  }

  return children;
}

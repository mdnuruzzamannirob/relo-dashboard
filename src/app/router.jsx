import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ResetPassword from "../pages/auth/ResetPassword";
import Overview from "../pages/dashboard/Overview";
import DashboardLayout from "@/layouts/DashboardLayout";
import Users from "../pages/dashboard/Users";
import Products from "../pages/dashboard/Products";
import Orders from "../pages/dashboard/Orders";
import Payments from "../pages/dashboard/Payments";
import CategoryAndLocker from "../pages/dashboard/CategoryAndLocker";
import Messages from "../pages/dashboard/Messages";
import Profile from "../pages/dashboard/Profile";
import AboutUs from "../pages/dashboard/AboutUs";
import PrivacyPolicy from "../pages/dashboard/PrivacyPolicy";
import TermsCondition from "../pages/dashboard/TermsCondition";
import HowItWorks from "../pages/dashboard/HowItWorks";
import TrustSafety from "../pages/dashboard/TrustSafety";
import HelpCenter from "../pages/dashboard/HelpCenter";
import SellingGuide from "../pages/dashboard/SellingGuide";
import BuyingGuide from "../pages/dashboard/BuyingGuide";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const router = createBrowserRouter([
  // Public Auth Routes (Protected - only accessible when NOT logged in)
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/verify-otp",
    element: (
      <PublicRoute>
        <VerifyOtp />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },

  // Protected Dashboard Routes
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/overview" replace />,
      },
      {
        path: "/dashboard",
        element: <Navigate to="/overview" replace />,
      },
      {
        path: "overview",
        element: <Overview />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "payments",
        element: <Payments />,
      },
      {
        path: "category&locker",
        element: <CategoryAndLocker />,
      },
      {
        path: "message",
        element: <Messages />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-condition",
        element: <TermsCondition />,
      },
      {
        path: "how-it-works",
        element: <HowItWorks />,
      },
      {
        path: "trust-safety",
        element: <TrustSafety />,
      },
      {
        path: "help-center",
        element: <HelpCenter />,
      },
      {
        path: "selling-guide",
        element: <SellingGuide />,
      },
      {
        path: "buying-guide",
        element: <BuyingGuide />,
      },
    ],
  },
  // 404 Not Found Route
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Resetpassword from "../pages/auth/Resetpassword";
import Overview from "../pages/dashboard/Overview";
import DashboardLayout from "@/layouts/DashboardLayout";
import Users from "../pages/dashboard/Users";
import Products from "../pages/dashboard/Products";
import Orders from "../pages/dashboard/Orders";
import Payments from "../pages/dashboard/Payments";
import Category from "../pages/dashboard/Category";
import Locker from "../pages/dashboard/Locker";
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

const router = createBrowserRouter([
  // Public Routes (No Layout)
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },
  {
    path: "/reset-password",
    element: <Resetpassword />,
  },

  // Protected Dashboard Routes
  {
    path: "/",
    element: <DashboardLayout />,
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
        path: "category",
        element: <Category />,
      },
      {
        path: "locker",
        element: <Locker />,
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

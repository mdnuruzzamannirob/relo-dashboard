import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import SetNewPasswordPage from "./pages/SetNewPasswordPage";
import Layout from "./pages/Layout"; // Import Layout
import DashboardPage from "./pages/Dashboard";
import AccountSettings from "./pages/AccountSettings";
import EditProfile from "./pages/EditProfile";
import PrivacySettings from "./pages/PrivacySettings";
import TermsAndConditions from "./pages/TermsAndConditions";
import UserManagement from "./pages/UserManagement";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import Order from "./pages/Order/Order";
import PaymentManagement from "./pages/PaymentManagement/PaymentManagement";
import CategoryLocker from "./pages/CategoryLocker/CategoryLocker";
import MessagePage from "./pages/MessagePage/MessagePage";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={ <Navigate to="/login" />} />

        {/* Routes without Sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgetPassword" element={<ForgotPasswordPage />} />
        <Route path="/verifyCode" element={<VerifyCodePage />} />
        <Route path="/setNewPassword" element={<SetNewPasswordPage />} />

        {/* Routes with Sidebar (using Layout) */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <DashboardPage />
            </Layout>
          }
        />
      
        <Route
          path="/users"
          element={
            <Layout>
              <UserManagement/>
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <ProductManagement/>
            </Layout>
          }
        />
      
        <Route
          path="/orders"
          element={
            <Layout>
              <Order/>
            </Layout>
          }
        />
        <Route
          path="/category-locker"
          element={
            <Layout>
              <CategoryLocker/>
            </Layout>
          }
        />
        <Route
          path="/message"
          element={
            <Layout>
              <MessagePage/>
            </Layout>
          }
        />
      
        <Route
          path="/payment-management"
          element={
            <Layout>
              <PaymentManagement/>
            </Layout>
          }
        />
      
       
        <Route
          path="/accountsettings"
          element={
            <Layout>
              <AccountSettings />
            </Layout>
          }
        />
        <Route
          path="/editprofile"
          element={
            <Layout>
              <EditProfile />
            </Layout>
          }
        />
        <Route
          path="/privacysettings"
          element={
            <Layout>
              <PrivacySettings />
            </Layout>
          }
        />
        <Route
          path="/termsandconditions"
          element={
            <Layout>
              <TermsAndConditions />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

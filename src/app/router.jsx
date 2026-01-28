import { createBrowserRouter } from 'react-router-dom';

import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import VerifyOtp from '../pages/auth/VerifyOtp';
import Resetpassword from '../pages/auth/Resetpassword';

// import DashboardLayout from '../layouts/DashboardLayout';

// import Overview from '../pages/dashboard/Overview';
// import Users from '../pages/dashboard/Users';
// import Orders from '../pages/dashboard/Orders';
// import Settings from '../pages/dashboard/Settings';

// import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter([
  // Public Routes (No Layout)
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/verify-otp',
    element: <VerifyOtp />,
  },
  {
    path: '/reset-password',
    element: <Resetpassword />,
  },

  // Protected Dashboard Routes
  // {
  //   path: '/dashboard',
  //   element: (
  //     <PrivateRoute>
  //       <DashboardLayout />
  //     </PrivateRoute>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: <Overview />,
  //     },
  //     {
  //       path: 'users',
  //       element: <Users />,
  //     },
  //     {
  //       path: 'orders',
  //       element: <Orders />,
  //     },
  //     {
  //       path: 'settings',
  //       element: <Settings />,
  //     },
  //   ],
  // },
]);

export default router;

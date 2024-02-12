import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import UserRoutes from "./UserRoutes";
import Dashboard from "../pages/dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  // dashboard
  {
    path: "/dashboard",
    element: <PrivateRoute element={<Dashboard />} />,
  },
  // registration routes
  {
    path: "/users/login",
    element: <UserRoutes path="/login" />,
  },
  {
    path: "/users/register",
    element: <UserRoutes path="/register" />,
  },
  {
    path: "/users/OTPVerification",
    element: <UserRoutes path="/OTPVerification" />,
  },
]);

export default router;

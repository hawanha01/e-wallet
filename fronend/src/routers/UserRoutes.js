import React from "react";
import Login from "../pages/registration/Login";
import Error from "../pages/error/Error";
import Signup from "../pages/registration/Signup";
import OTPVerification from "../pages/registration/OTPVerification";

export default function UserRoutes({ path }) {
  let component;
  switch (path) {
    case "/login":
      component = <Login />;
      break;
    case "/register":
      component = <Signup />;
      break;
    case "/OTPVerification":
      component = <OTPVerification />;
      break;
    default:
      component = <Error />;
      break;
  }
  return component;
}

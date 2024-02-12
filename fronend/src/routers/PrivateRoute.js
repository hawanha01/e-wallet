import React from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PrivateRoute({ element }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!currentUser) {
      navigate("/users/login");
    }
  });
  return currentUser ? element : null;
}

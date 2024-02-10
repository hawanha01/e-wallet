import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/logout");
      if (response.data.success) {
        navigate("/users/login");
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div>
      <h1>Hello {location.state.name}</h1>
      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  );
}

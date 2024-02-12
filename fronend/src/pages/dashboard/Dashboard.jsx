import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import Wallet from "../../components/Wallet/Wallet";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/logout");
      if (response.data.success) {
        logout();
        navigate("/users/login");
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div>
      <h1>Hello {currentUser.name}</h1>
      <Wallet user={currentUser} />
      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  );
}

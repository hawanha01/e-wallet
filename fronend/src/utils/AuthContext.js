import React from "react";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const login = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const logout = () => {
    localStorage.setItem("currentUser", null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: JSON.parse(localStorage.getItem("currentUser")),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

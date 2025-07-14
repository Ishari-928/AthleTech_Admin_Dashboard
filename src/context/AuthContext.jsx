import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create context
const AuthContext = createContext();

// 2. Custom hook
export const useAuth = () => useContext(AuthContext);

// 3. Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on page reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // 4. Login function
  const login = async ({ username, password }) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/admin_auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Important for cookies/token
        body: JSON.stringify({
          email: username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid login");
      }

      const data = await response.json();

      // Save token and role to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      setIsAuthenticated(true);
      return true;
    } catch (err) {
      alert("Login failed: " + err.message);
      return false;
    }
  };

  // 5. Logout function
  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

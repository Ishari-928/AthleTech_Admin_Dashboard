import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { loginAdmin } from "../api/login";

// 1. Create context
const AuthContext = createContext();

// 2. Custom hook
export const useAuth = () => useContext(AuthContext);



// 3. Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on page reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    if (token && name && role && email) {
      setUser({ name, role, email });
      setIsAuthenticated(true);
    }
  }, []);

  // 4. Login function
  const login = async ({ email, password }) => {
    try {
      const response = await loginAdmin({ email, password });
      const data = response.data;
      console.log("Login response data:", data);
      // localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name); 
      localStorage.setItem("role", data.user_role);
      localStorage.setItem("email", data.email);

      setUser({ name: data.name, role: data.user_role, email: data.email });
      setIsAuthenticated(true);
      return data; 
    } catch (err) {
      // alert("Login failed: " + (err.response?.data?.message || err.message));
      throw err; // important! so handleSubmit catch can read err.response.data.message
    }
  };

  // 5. Logout function
  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

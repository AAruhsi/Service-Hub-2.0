import { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(BASE_URL + "/auth/profile", {
          withCredentials: true,
        });
        setUser(response.data.data);
        setLoggedIn(true);
      } catch (error) {
        console.log("Please login again");
        setUser(null);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  const value = {
    loading,
    setLoading,
    isLoggedIn,
    setLoggedIn,
    user,
    setUser,
    setRole,
    role,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

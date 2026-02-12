import { createContext, useEffect, useState } from "react";
import api from "../axios/axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/isAuth");
        setUser(res.data.user);
        setIsAuth(true);
      } catch {
        setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuth, setIsAuth, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

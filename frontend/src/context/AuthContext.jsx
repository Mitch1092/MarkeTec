import { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔥 cargar usuario al refrescar página
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      client.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
    }
  }, []);

  // LOGIN
  const login = async (data) => {
    const res = await client.post("/login", data);

    const token = res.data.token;
    const user = res.data.user;

    localStorage.setItem("token", token);
    setUser(user);
    console.log("USER ACTUAL:", user);
    console.log(res.data);
    return user;
  };

  // LOGOUT
  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
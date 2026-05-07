import AuthForm from "../components/AuthForm";
import client from "../api/client";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignInView() {
  const { login } = useAuth();

  const handleLogin = async (form) => {
    await login(form); // 🔥 SOLO ESTO
  };


  const logout = async () => {
    await client.post("/logout");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const getPosts = async () => {
    const res = await client.get("/posts");
    return res.data;
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}
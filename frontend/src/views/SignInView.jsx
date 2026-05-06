import AuthForm from "../components/AuthForm";
import client from "../api/client";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignInView() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    // 🔐 1. pedir CSRF cookie primero
    await client.get("/sanctum/csrf-cookie");

    // 🔐 2. login real
    const res = await client.post("/api/login", data);

    login(res.data);
    navigate("/profile");
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}
import AuthForm from "../components/AuthForm";
import client from "../api/client";
import { useNavigate } from "react-router-dom";


export default function RegisterView() {
  const navigate = useNavigate();
  const handleRegister = async (data) => {
    const res = await client.post("/register", data);

    localStorage.setItem("token", res.data.token);

    alert("Usuario creado");
    navigate("/signin");
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
}
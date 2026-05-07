import AuthForm from "../components/AuthForm";
import client from "../api/client";

export default function RegisterView() {
  const handleRegister = async (data) => {
    const res = await client.post("/register", data);

    localStorage.setItem("token", res.data.token);

    alert("Usuario creado");
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
}
import AuthForm from "../components/AuthForm";
import client from "../api/client";

export default function RegisterView() {
  const handleRegister = async (data) => {
    await client.post("/users", data);
    alert("Usuario creado");
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
}
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

export default function AuthForm({ type = "login", onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    ncontrol: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{type === "login" ? "Login" : "Registro"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {type === "register" && (
        <Input
          label="Nombre"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />



      )}

      {type === "register" && (
    

        <Input
          label="N.Control"
          value={form.ncontrol}
          onChange={(e) => handleChange("ncontrol", e.target.value)}
        />

      )}

      <Input
        label="Email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      {type === "register" && (
    

        <Input
          label="Teléfono"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

      )}

      <Input
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      <Button type="submit">
        {loading ? "Cargando..." : type === "login" ? "Entrar" : "Registrarse"}
      </Button>
    </form>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
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

  const isLogin = type === "login";

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px 32px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '8px' }}>
          {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          {isLogin ? "Ingresa tus datos para continuar" : "Únete a la comunidad de Marketec"}
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              backgroundColor: 'rgba(250, 56, 62, 0.1)', 
              color: 'var(--color-error)', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {!isLogin && (
            <>
              <Input
                label="Nombre Completo"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
              <Input
                label="Número de Control"
                value={form.ncontrol}
                onChange={(e) => handleChange("ncontrol", e.target.value)}
                required
              />
            </>
          )}

          <Input
            label="Correo Electrónico"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />

          {!isLogin && (
            <Input
              label="Teléfono (WhatsApp)"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          )}

          <Input
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />

          <div style={{ marginTop: '32px' }}>
            <Button type="submit" disabled={loading} style={{ padding: '12px' }}>
              {loading ? "Cargando..." : isLogin ? "Iniciar Sesión" : "Registrarse"}
            </Button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          {isLogin ? (
            <>
              ¿No tienes cuenta? <Link to="/signup" style={{ fontWeight: 'bold' }}>Regístrate</Link>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta? <Link to="/signin" style={{ fontWeight: 'bold' }}>Inicia sesión</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
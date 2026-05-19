import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header style={{ background: "#222", padding: "10px" }}>
        <nav style={{ display: "flex", gap: "10px", color: "white" }}>
          <Link to="/">Inicio</Link>
          <Link to="/browsing">Explorar</Link>

          {user && <Link to="/posting">Crear</Link>}
          {user && <Link to="/profile">Perfil</Link>}

          {!user && <Link to="/signin">Login</Link>}
          {!user && <Link to="/signup">Registro</Link>}
          {user?.admin && (
            <Link to="/admin" style={{ color: "white" }}>
              Admin
            </Link>
          )}
          {user && (
            <button onClick={logout} style={{ marginLeft: "auto" }}>
              Salir
            </button>
          )}
        </nav>
      </header>

      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}
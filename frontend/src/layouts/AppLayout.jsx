import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            Marketec
          </Link>

          <nav className="nav-links">
            <Link to="/browsing" className="nav-link">Explorar</Link>

            {user && <Link to="/posting" className="nav-link">Crear</Link>}
            {user && <Link to="/profile" className="nav-link">Perfil</Link>}

            {!user && <Link to="/signin" className="nav-link">Login</Link>}
            {!user && <Link to="/signup" className="nav-link btn btn-primary" style={{ color: 'white' }}>Registro</Link>}

            {user?.admin && (
              <Link to="/admin" className="nav-link" style={{ color: "var(--color-error)" }}>
                Admin
              </Link>
            )}

            {user && (
              <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: "8px" }}>
                Salir
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="container main-content" style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}
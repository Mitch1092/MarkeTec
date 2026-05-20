import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import PostGrid from "../components/PostGrid";
import { useAuth } from "../context/AuthContext";

export default function MainView() {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await client.get("/posts");
      // Muestra solo los primeros 8 para la pantalla principal
      setPosts(res.data.slice(0, 8));
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex-col gap-6">
      {/* HERO SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '60px 40px',
        color: 'white',
        textAlign: 'center',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: 'white', fontSize: '48px', margin: '0 0 16px 0', letterSpacing: '-1px' }}>
          Bienvenido a Marketec
        </h1>
        <p style={{ fontSize: '20px', maxWidth: '600px', margin: '0 auto 32px auto', opacity: 0.9 }}>
          Compra y vende productos de forma fácil y segura en tu comunidad universitaria.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/browsing" className="btn" style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}>
            Explorar Productos
          </Link>
          {user ? (
            <Link to="/posting" className="btn btn-primary" style={{ border: '2px solid white' }}>
              Crear Publicación
            </Link>
          ) : (
            <Link to="/signup" className="btn btn-primary" style={{ border: '2px solid white' }}>
              Únete Ahora
            </Link>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center" style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '24px', margin: 0 }}>Publicaciones Recientes</h2>
        <Link to="/browsing" style={{ fontWeight: 'bold' }}>Ver todas &rarr;</Link>
      </div>

      <PostGrid posts={posts} />
    </div>
  );
}
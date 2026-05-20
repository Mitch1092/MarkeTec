import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import UserCard from "../components/UserCard";

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    loadPost();
    loadCurrentUser();
  }, [id]);

  const isOwner =
    currentUser &&
    post &&
    currentUser.id === post.user_id;

  const loadCurrentUser = async () => {
    try {
      const res = await client.get("/me");
      setCurrentUser(res.data);
    } catch {
      // Usuario no autenticado
      setCurrentUser(null);
    }
  };

  const loadPost = async () => {
    const res = await client.get(`/posts/${id}`);
    setPost(res.data);
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este post?")) return;

    await client.delete(`/posts/${post.id}`);

    alert("Post eliminado");
    navigate("/");
  };

  if (!post) return <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--color-text-secondary)' }}>Cargando...</p>;

  return (
    <div className="container" style={{ maxWidth: "1000px" }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        
        {/* LADO IZQUIERDO: IMÁGENES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {post.images && post.images.length > 0 ? (
            <>
              {/* Imagen principal grande */}
              <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <img
                  src={`http://localhost:8000/storage/${post.images[0].path}`}
                  alt={post.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              
              {/* Miniaturas de otras imágenes si las hay */}
              {post.images.length > 1 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "10px" }}>
                  {post.images.slice(1).map((img) => (
                    <img
                      key={img.id}
                      src={`http://localhost:8000/storage/${img.path}`}
                      alt=""
                      style={{ width: "100%", aspectRatio: "1/1", borderRadius: "var(--radius-md)", objectFit: "cover", border: '1px solid var(--color-border)' }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)' }}>
              Sin imágenes
            </div>
          )}
        </div>

        {/* LADO DERECHO: DETALLES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ 
                backgroundColor: post.venta ? 'var(--color-sale)' : 'var(--color-buy)', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: 'var(--radius-pill)', 
                fontSize: '14px', 
                fontWeight: 'bold' 
              }}>
                {post.venta ? 'En Venta' : 'Buscando'}
              </span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                Publicado {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            <h1 style={{ fontSize: '32px', margin: '0 0 16px 0', lineHeight: '1.2' }}>{post.title}</h1>

            {post.venta && (
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '24px' }}>
                ${post.price}
              </div>
            )}

            <div style={{ 
              whiteSpace: 'pre-wrap', 
              color: 'var(--color-text-secondary)',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              {post.description}
            </div>

            {isOwner && (
              <div style={{ display: "flex", gap: "12px", paddingTop: '20px', borderTop: '1px solid var(--color-border-light)' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate(`/posts/${post.id}/edit`)}>
                  Editar Publicación
                </button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleDelete}>
                  Eliminar
                </button>
              </div>
            )}
          </div>

          {/* INFORMACIÓN DEL USUARIO */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Información del Vendedor</h3>
            <UserCard user={post.user} />
          </div>

        </div>
      </div>
    </div>
  );
}
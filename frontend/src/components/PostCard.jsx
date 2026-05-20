import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  // Azul si es venta, naranja si es búsqueda/compra
  const tagColor = post.venta ? "var(--color-sale)" : "var(--color-buy)";
  const tagText = post.venta ? "Venta" : "Buscando";

  return (
    <Link to={`/posts/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        
        {/* Etiqueta de tipo (Venta/Compra) */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: tagColor,
          color: 'white',
          padding: '4px 10px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 10,
          boxShadow: 'var(--shadow-sm)'
        }}>
          {tagText}
        </div>

        {/* IMAGEN */}
        <div style={{
          width: "100%",
          aspectRatio: "1 / 1",
          backgroundColor: "var(--color-border-light)",
          position: 'relative',
          overflow: 'hidden'
        }}>
          {post.images?.[0] ? (
            <img
              src={`http://localhost:8000/storage/${post.images[0].path}`}
              alt={post.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform var(--transition-normal)"
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-tertiary)",
              fontSize: "14px",
            }}>
              Sin imagen
            </div>
          )}
        </div>

        {/* CONTENIDO */}
        <div style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}>
          {/* TÍTULO */}
          <h3 style={{
            margin: "0 0 8px 0",
            fontSize: "16px",
            lineHeight: "1.3",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            color: "var(--color-text-primary)",
            minHeight: "42px"
          }}>
            {post.title}
          </h3>

          <div style={{ flexGrow: 1 }}></div>

          {/* PRECIO Y USUARIO */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}>
            {post.venta && (
              <span style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "var(--color-text-primary)"
              }}>
                ${post.price}
              </span>
            )}
            
            <span style={{
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {post.user?.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
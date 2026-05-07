import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <Link
      to={`/posts/${post.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",

          height: "380px",
          display: "flex",
          flexDirection: "column",

          background: "white",
        }}
      >
        {/* IMAGEN */}
        <div
          style={{
            width: "100%",
            height: "220px",
            background: "#eee",
            flexShrink: 0,
          }}
        >
          {post.images?.[0] ? (
            <img
              src={`http://localhost:8000/storage/${post.images[0].path}`}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
                fontSize: "14px",
              }}
            >
              Sin imagen
            </div>
          )}
        </div>

        {/* CONTENIDO */}
        <div
          style={{
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* TITULO */}
          <h3
            style={{
              margin: 0,
              marginBottom: "10px",

              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",

              minHeight: "48px",
            }}
          >
            {post.title}
          </h3>

          {/* ESPACIO FLEX */}
          <div style={{ flex: 1 }} />

          {/* FOOTER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: "30px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#666",
              }}
            >
              {post.user?.name}
            </span>

            {post.venta ? (
              <strong>${post.price}</strong>
            ) : (
              <span
                style={{
                  color: "#888",
                  fontSize: "14px",
                }}
              >
                Compra de...
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
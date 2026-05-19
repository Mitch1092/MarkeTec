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

  if (!post) return <p>Cargando...</p>;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>{post.title}</h1>

      {/* IMÁGENES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: "15px",
        }}
      >
        {post.images?.map((img) => (
          <img
            key={img.id}
            src={`http://localhost:8000/storage/${img.path}`}
            alt=""
            style={{
              width: "100%",
              borderRadius: "10px",
            }}
          />
        ))}
      </div>

      {/* DESCRIPCIÓN */}
      <p style={{ marginTop: "20px" }}>
        {post.description}
      </p>

      {/* FECHA */}
      <p>
        Creado:{" "}
        {new Date(post.created_at).toDateString()}
      </p>



      {/* PRECIO SOLO SI ES VENTA */}
      {post.venta && (
        <h2>${post.price}</h2>
      )}

      {/* BOTONES SI ES EL DUEÑO */}
      {isOwner && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() =>
              navigate(`/posts/${post.id}/edit`)
            }
          >
            Editar
          </button>

          <button
            onClick={handleDelete}
            style={{
              background: "#dc2626",
              color: "white",
            }}
          >
            Eliminar
          </button>
        </div>
      )}

      {/* USER CARD DEL AUTOR */}
      <div style={{ marginTop: "40px" }}>
        <h2>Información del usuario</h2>

        <UserCard user={post.user} />
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import client from "../api/client";

export default function PostView() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    loadPost();
  }, []);

  useEffect(() => {
    loadPost();
    loadCurrentUser();
  }, [id]);
  const isOwner =
    currentUser &&
    post &&
    currentUser.id === post.user_id;

  const loadCurrentUser = async () => {
    const res = await client.get("/me");
    setCurrentUser(res.data);
  };

  const loadPost = async () => {
    const res = await client.get(`/posts/${id}`);
    setPost(res.data);
  };

  if (!post) return <p>Cargando...</p>;
  const handleDelete = async () => {
    if (!confirm("¿Eliminar este post?")) return;

    await client.delete(`/posts/${post.id}`);

    alert("Post eliminado");
    navigate("/");
  };
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>{post.title}</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: "15px",
        }}
      >
        {post.images.map((img) => (
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

      <p style={{ marginTop: "20px" }}>
        {post.description}
      </p>

      <p>
        Creado:
        {" "}
        {new Date(post.created_at).toDateString()}
      </p>

      <p>
        Usuario:
        {" "}
        <Link to={`/users/${post.user.id}`}>
          {post.user.name}
        </Link>
      </p>

      {post.venta && (
        <h2>${post.price}</h2>
      )}
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
    </div>

  );
}
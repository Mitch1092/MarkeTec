import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../api/client";

export default function PostView() {
  const { id } = useParams();

  const [post, setPost] = useState(null);

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    const res = await client.get(`/posts/${id}`);
    setPost(res.data);
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
    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import PostCard from "../components/PostCard";

export default function PublicUserView() {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const res = await client.get(`/users/${id}`);
    setUser(res.data);
  };

  if (!user) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{user.name}</h1>

      <p>{user.email}</p>

      <h2>Posts</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {user.posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}
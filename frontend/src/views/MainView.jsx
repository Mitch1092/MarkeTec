import { useEffect, useState } from "react";
import client from "../api/client";
import PostGrid from "../components/PostGrid";

export default function MainView() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await client.get("/posts");
      setPosts(res.data);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Todos los posts</h1>
      <PostGrid posts={posts} />
    </div>
  );
}
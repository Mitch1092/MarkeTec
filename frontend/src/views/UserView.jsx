import { useEffect, useState } from "react";
import client from "../api/client";
import PostGrid from "../components/PostGrid";

export default function UserView() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const res = await client.get("/my-posts");
      setPosts(res.data);
    };

    fetchMyPosts();
  }, []);

  return (
    <div>
      <h1>Mis posts</h1>

      <PostGrid posts={posts} />
    </div>
  );
}
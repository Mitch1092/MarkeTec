import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import PostCard from "../components/PostCard";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";

export default function PublicUserView() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadCurrentUser();
  }, [id]);

  const loadUser = async () => {
    const res = await client.get(`/users/${id}`);
    setUser(res.data);
  };

  const loadCurrentUser = async () => {
    const res = await client.get("/me");
    setCurrentUser(res.data);
  };

  const handleReviewCreated = (review) => {
    setUser({
      ...user,
      reviews_received: [
        review,
        ...(user.reviews_received || []),
      ],
    });
  };

  if (!user || !currentUser) return <p>Cargando...</p>;

  const canReview = currentUser.id !== user.id;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>

      {canReview && (
        <ReviewForm
          reviewedId={user.id}
          onCreated={handleReviewCreated}
        />
      )}

      <h2>Reviews</h2>

      {(user.reviews_received || []).map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
        />
      ))}

      <h2>Posts</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(250px,1fr))",
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
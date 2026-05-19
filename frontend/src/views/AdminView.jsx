import { useEffect, useState, useMemo } from "react";
import client from "../api/client";

import UserCard from "../components/UserCard";
import ReviewCard from "../components/ReviewCard";
import ReportCard from "../components/ReportCard";
import PostCard from "../components/PostCard";

export default function AdminView() {
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState([]);

  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [usersRes, reviewsRes, reportsRes, postsRes] =
      await Promise.all([
        client.get("/users"),
        client.get("/reviews"),
        client.get("/reports"),
        client.get("/posts"),
      ]);

    setUsers(usersRes.data);
    setReviews(reviewsRes.data);
    setReports(reportsRes.data);
    setPosts(postsRes.data);
  };

  // 🔎 USERS FILTER
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = userSearch.toLowerCase();
      return (
        user.name?.toLowerCase().includes(q) ||
        user.ncontrol?.toLowerCase().includes(q)
      );
    });
  }, [users, userSearch]);

  // DELETE HELPERS
  const deleteUser = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    await client.delete(`/users/${id}`);
    setUsers(users.filter((u) => u.id !== id));
  };

  const deleteReview = async (id) => {
    if (!confirm("¿Eliminar esta reseña?")) return;
    await client.delete(`/reviews/${id}`);
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const deleteReport = async (id) => {
    if (!confirm("¿Eliminar este reporte?")) return;
    await client.delete(`/reports/${id}`);
    setReports(reports.filter((r) => r.id !== id));
  };

  const deletePost = async (id) => {
    if (!confirm("¿Eliminar este post?")) return;
    await client.delete(`/posts/${id}`);
    setPosts(posts.filter((p) => p.id !== id));
  };

  const tabButtonStyle = (tab) => ({
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    background: activeTab === tab ? "#2563eb" : "#e5e7eb",
    color: activeTab === tab ? "white" : "black",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h1>Panel de Administración</h1>

      {/* TABS */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => setActiveTab("users")} style={tabButtonStyle("users")}>
          Usuarios ({users.length})
        </button>

        <button onClick={() => setActiveTab("reviews")} style={tabButtonStyle("reviews")}>
          Reseñas ({reviews.length})
        </button>

        <button onClick={() => setActiveTab("reports")} style={tabButtonStyle("reports")}>
          Reportes ({reports.length})
        </button>

        <button onClick={() => setActiveTab("posts")} style={tabButtonStyle("posts")}>
          Posts ({posts.length})
        </button>
      </div>

      {/* USERS */}
      {activeTab === "users" && (
        <>
          <input
            placeholder="Buscar usuario..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              maxWidth: "400px",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredUsers.map((user) => (
              <div key={user.id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <UserCard user={user} />

                <button onClick={() => deleteUser(user.id)} style={{ background: "#dc2626", color: "white", padding: "10px", borderRadius: "8px" }}>
                  Eliminar usuario
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* REVIEWS */}
      {activeTab === "reviews" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {reviews.map((review) => (
            <div key={review.id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <ReviewCard review={review} />

              <button onClick={() => deleteReview(review.id)} style={{ background: "#dc2626", color: "white", padding: "10px", borderRadius: "8px" }}>
                Eliminar reseña
              </button>
            </div>
          ))}
        </div>
      )}

      {/* REPORTS */}
      {activeTab === "reports" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {reports.map((report) => (
            <div key={report.id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <ReportCard report={report} />

              <button onClick={() => deleteReport(report.id)} style={{ background: "#dc2626", color: "white", padding: "10px", borderRadius: "8px" }}>
                Eliminar reporte
              </button>
            </div>
          ))}
        </div>
      )}

      {/* POSTS */}
      {activeTab === "posts" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {posts.map((post) => (
            <div key={post.id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <PostCard post={post} />

              <button
                onClick={() => deletePost(post.id)}
                style={{
                  background: "#dc2626",
                  color: "white",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                Eliminar post
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
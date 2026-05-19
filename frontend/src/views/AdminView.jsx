import { useEffect, useState, useMemo } from "react";
import client from "../api/client";

import UserCard from "../components/UserCard";
import ReviewCard from "../components/ReviewCard";
import ReportCard from "../components/ReportCard";
import PostCard from "../components/PostCard";
import ToggleAdmin from "../components/ToggleAdmin";

export default function AdminView() {
  const [activeTab, setActiveTab] = useState("users");
  const [showActive, setShowActive] = useState(true);

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
      const matchesSearch = user.name?.toLowerCase().includes(q) || user.ncontrol?.toLowerCase().includes(q);
      const matchesState = showActive ? user.activa : !user.activa;
      return matchesSearch && matchesState;
    });
  }, [users, userSearch, showActive]);

  // TOGGLE HELPERS
  const toggleUser = async (id, isActive) => {
    if (isActive) {
      if (!confirm("¿Desactivar este usuario?")) return;
      await client.delete(`/users/${id}`);
    } else {
      await client.patch(`/users/${id}/reactivate`, { activa: true });
    }
    setUsers(users.map((u) => (u.id === id ? { ...u, activa: !isActive } : u)));
  };

  const toggleReview = async (id, isActive) => {
    if (isActive) {
      if (!confirm("¿Desactivar esta reseña?")) return;
      await client.delete(`/reviews/${id}`);
    } else {
      await client.patch(`/reviews/${id}/reactivate`, { activa: true });
    }
    setReviews(reviews.map((r) => (r.id === id ? { ...r, activa: !isActive } : r)));
  };

  const toggleReport = async (id, isActive) => {
    if (isActive) {
      if (!confirm("¿Marcar este reporte como revisado (desactivar)?")) return;
      await client.delete(`/reports/${id}`);
    } else {
      await client.patch(`/reports/${id}/reactivate`, { activa: true });
    }
    setReports(reports.map((r) => (r.id === id ? { ...r, activa: !isActive } : r)));
  };

  const togglePost = async (id, isActive) => {
    if (isActive) {
      if (!confirm("¿Desactivar este post?")) return;
      await client.delete(`/posts/${id}`);
    } else {
      await client.patch(`/posts/${id}/reactivate`, { activa: true });
    }
    setPosts(posts.map((p) => (p.id === id ? { ...p, activa: !isActive } : p)));
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
          Usuarios ({users.filter(u => showActive ? u.activa : !u.activa).length})
        </button>

        <button onClick={() => setActiveTab("reviews")} style={tabButtonStyle("reviews")}>
          Reseñas ({reviews.filter(r => showActive ? r.activa : !r.activa).length})
        </button>

        <button onClick={() => setActiveTab("reports")} style={tabButtonStyle("reports")}>
          Reportes ({reports.filter(r => showActive ? r.activa : !r.activa).length})
        </button>

        <button onClick={() => setActiveTab("posts")} style={tabButtonStyle("posts")}>
          Posts ({posts.filter(p => showActive ? p.activa : !p.activa).length})
        </button>
      </div>

      {/* 🎚️ SLIDER */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span style={{ fontWeight: !showActive ? "bold" : "normal" }}></span>
        <ToggleAdmin value={showActive} onChange={setShowActive} />
        <span style={{ fontWeight: showActive ? "bold" : "normal" }}></span>
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

                <button
                  onClick={() => toggleUser(user.id, user.activa)}
                  style={{ background: user.activa ? "#dc2626" : "#16a34a", color: "white", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer" }}
                >
                  {user.activa ? "Desactivar usuario" : "Reactivar usuario"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* REVIEWS */}
      {activeTab === "reviews" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {reviews.filter(r => showActive ? r.activa : !r.activa).map((review) => (
            <div key={review.id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <ReviewCard review={review} />

              <button
                onClick={() => toggleReview(review.id, review.activa)}
                style={{ background: review.activa ? "#dc2626" : "#16a34a", color: "white", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer" }}
              >
                {review.activa ? "Desactivar reseña" : "Reactivar reseña"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* REPORTS */}
      {activeTab === "reports" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {reports.filter(r => showActive ? r.activa : !r.activa).map((report) => (
            <div key={report.id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <ReportCard report={report} />

              <button
                onClick={() => toggleReport(report.id, report.activa)}
                style={{ background: report.activa ? "#dc2626" : "#16a34a", color: "white", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer" }}
              >
                {report.activa ? "Marcar como revisado (Desactivar)" : "Reactivar reporte"}
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
          {posts.filter(p => showActive ? p.activa : !p.activa).map((post) => (
            <div key={post.id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <PostCard post={post} />

              <button
                onClick={() => togglePost(post.id, post.activa)}
                style={{ background: post.activa ? "#dc2626" : "#16a34a", color: "white", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer" }}
              >
                {post.activa ? "Desactivar post" : "Reactivar post"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
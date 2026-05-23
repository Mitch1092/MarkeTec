// PublicUserView.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";
import PostCard from "../components/PostCard";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import ReportForm from "../components/ReportForm";
import { useAuth } from "../context/AuthContext";

export default function PublicUserView() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.id == id) {
      navigate('/profile', { replace: true });
    }
  }, [currentUser, id, navigate]);

  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState("posts");

  const [existingReview, setExistingReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    loadUser();
  }, [id]);

  useEffect(() => {
    if (!user || !currentUser) return;

    const existing = user.reviews_received?.find(
      (review) => review.reviewer_id === currentUser.id
    );

    setExistingReview(existing || null);
  }, [user, currentUser]);

  const loadUser = async () => {
    try {
      const res = await client.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewCreated = (review) => {
    setUser((prev) => ({
      ...prev,
      reviews_received: [
        review,
        ...(prev.reviews_received || []),
      ],
    }));

    setShowReviewModal(false);
    setActiveTab("reviews");
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  const canReview = currentUser && currentUser.id !== user.id;

  const reviews = user.reviews_received || [];
  const averageScore =
      reviews.length > 0
          ? (
              reviews.reduce(
                  (sum, review) => sum + Number(review.score),
                  0
              ) / reviews.length
          ).toFixed(1)
          : "Sin reseñas";

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* CABECERA */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <p
              style={{
                  marginTop: "10px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#2563eb",
              }}
          >
              ⭐ Calificación promedio: {averageScore}
          </p>

          {user.phone && (
            <a
              href={`https://wa.me/52${user.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                display: 'inline-block',
                backgroundColor: '#25D366',
                color: 'white',
                marginTop: '15px',
                fontSize: '16px',
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              <span style={{ marginRight: '8px' }}>💬</span> Contactar por WhatsApp
            </a>
          )}
        </div>

        {canReview && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setShowReviewModal(true)}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "#2563eb",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {existingReview ? "Editar reseña" : "Reseñar usuario"}
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "#dc2626",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Reportar usuario
            </button>
          </div>
        )}
      </div>

      {/* PESTAÑAS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <button
          onClick={() => setActiveTab("posts")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background:
              activeTab === "posts" ? "#2563eb" : "white",
            color:
              activeTab === "posts" ? "white" : "black",
            fontWeight: "bold",
          }}
        >
          Posts ({user.posts?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background:
              activeTab === "reviews" ? "#2563eb" : "white",
            color:
              activeTab === "reviews" ? "white" : "black",
            fontWeight: "bold",
          }}
        >
          Reviews ({user.reviews_received?.length || 0})
        </button>
      </div>

      {/* CONTENIDO TAB POSTS */}
      {activeTab === "posts" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {user.posts?.length > 0 ? (
            user.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
              />
            ))
          ) : (
            <p>Este usuario no tiene posts.</p>
          )}
        </div>
      )}

      {/* CONTENIDO TAB REVIEWS */}
      {activeTab === "reviews" && (
        <div>
          {user.reviews_received?.length > 0 ? (
            user.reviews_received.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
              />
            ))
          ) : (
            <p>Este usuario aún no tiene reviews.</p>
          )}
        </div>
      )}

      {/* MODAL REVIEW */}
      {showReviewModal && (
        <div
          onClick={() => setShowReviewModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "30px",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* BOTÓN CERRAR */}
            <button
              onClick={() => setShowReviewModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "transparent",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <ReviewForm
              reviewedId={user.id}
              existingReview={existingReview}
              onCreated={(review) => {
                setShowReviewModal(false);
                loadUser();
                setActiveTab("reviews");
              }}
            />
          </div>
        </div>
      )}

      {showReportModal && (
        <div
          onClick={() => setShowReportModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "30px",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* BOTÓN CERRAR */}
            <button
              onClick={() => setShowReportModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "transparent",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <ReportForm
              reportedId={user.id}
              onCreated={() => {
                alert("¿Enviar reporte?");
                setShowReportModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import client from "../api/client";
import PostGrid from "../components/PostGrid";
import { useAuth } from "../context/AuthContext";

export default function UserView() {
  const [posts, setPosts] = useState([]);
  const { user, setUser } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    ncontrol: "",
    current_password: "",
    password: "",
  });

  useEffect(() => {
    const fetchMyPosts = async () => {
      const res = await client.get("/my-posts");
      setPosts(res.data);
    };

    const fetchMe = async () => {
      const res = await client.get("/me");
      setUser(res.data);
    };

    fetchMyPosts();
    fetchMe();
  }, [setUser]);

  const handleEditClick = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      ncontrol: user.ncontrol || "",
      current_password: "",
      password: "",
    });
    setShowEditModal(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await client.put(`/users/${user.id}`, editForm);
      setUser({ ...user, ...res.data });
      setShowEditModal(false);
      alert("Perfil actualizado correctamente");
    } catch (err) {
      alert(err.response?.data?.message || "Error al actualizar el perfil");
    }
  };

  const reviews = user?.reviews_received || [];
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
    <div>
      {user && (
        <div style={{ marginBottom: "30px", padding: "20px", background: "white", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <h1 style={{ marginTop: 0 }}>Mi Perfil</h1>
              <p style={{ margin: "5px 0" }}>{user.name}</p>
              <p style={{ margin: "5px 0", color: "#666" }}>{user.email}</p>
              <p style={{ margin: "5px 0", color: "#666" }}>Teléfono: {user.phone || "No especificado"}</p>
              <p
                  style={{
                      marginTop: "15px",
                      marginBottom: 0,
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#2563eb",
                  }}
              >
                  ⭐ Mi calificación promedio: {averageScore}
              </p>
            </div>
            
            <button
              onClick={handleEditClick}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Editar Perfil
            </button>
          </div>
        </div>
      )}

      {/* MODAL PARA EDITAR PERFIL */}
      {showEditModal && (
        <div
          onClick={() => setShowEditModal(false)}
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
              maxWidth: "500px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowEditModal(false)}
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

            <h2 style={{ marginTop: 0 }}>Editar Perfil</h2>

            <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Correo Electrónico</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Teléfono</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  placeholder="Dejar en blanco para no cambiarla"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }}
                />
              </div>

              <hr style={{ margin: "10px 0", border: "none", borderTop: "1px solid #eee" }} />

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#dc2626" }}>Contraseña Actual (requerida)</label>
                <input
                  type="password"
                  placeholder="Confirma tu contraseña actual"
                  value={editForm.current_password}
                  onChange={(e) => setEditForm({ ...editForm, current_password: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #dc2626", boxSizing: "border-box" }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginTop: "10px",
                }}
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: "20px" }}>Mis posts</h2>

      <PostGrid posts={posts} />
    </div>
  );
}
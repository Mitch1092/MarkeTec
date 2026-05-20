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
    <div className="flex-col gap-6">
      {user && (
        <div className="card" style={{ padding: '32px' }}>
          <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '20px' }}>
            <div className="flex items-center gap-4">
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: 'var(--color-primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', fontWeight: 'bold'
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>Mi Perfil</h1>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{user.name}</p>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)' }}>{user.email}</p>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)' }}>Tel: {user.phone || "No especificado"}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                  <span style={{ color: '#f59e0b', fontSize: '20px' }}>★</span>
                  <span style={{ fontWeight: 'bold' }}>{averageScore}</span>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>({reviews.length})</span>
                </div>
              </div>
            </div>
            
            <button className="btn btn-secondary" onClick={handleEditClick}>
              Editar Perfil
            </button>
          </div>
        </div>
      )}

      {/* MODAL PARA EDITAR PERFIL */}
      {showEditModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", justifyContent: "center", alignItems: "center",
          padding: "20px", zIndex: 1000, backdropFilter: 'blur(4px)'
        }} onClick={() => setShowEditModal(false)}>
          
          <div className="card" style={{ padding: '32px', width: '100%', maxWidth: '500px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowEditModal(false)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--color-text-tertiary)'
            }}>
              ×
            </button>

            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Editar Perfil</h2>

            <form onSubmit={handleUpdateProfile} className="flex-col gap-4">
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: '14px' }}>Correo Electrónico</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="input-field" required />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: '14px' }}>Teléfono</label>
                <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="input-field" required />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: '14px' }}>Nueva Contraseña (opcional)</label>
                <input type="password" placeholder="Dejar en blanco para no cambiarla" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} className="input-field" />
              </div>

              <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid var(--color-border-light)" }} />

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: '14px', color: 'var(--color-error)' }}>Contraseña Actual (requerida)</label>
                <input type="password" placeholder="Confirma tu contraseña actual" value={editForm.current_password} onChange={(e) => setEditForm({ ...editForm, current_password: e.target.value })} className="input-field" style={{ borderColor: 'var(--color-error)' }} required />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }}>
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      <div>
        <h2 style={{ marginBottom: "20px" }}>Mis Publicaciones</h2>
        <PostGrid posts={posts} />
      </div>
    </div>
  );
}
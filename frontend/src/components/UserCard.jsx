import { Link } from "react-router-dom";

export default function UserCard({ user }) {
  // Calcular promedio de scores recibidos
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

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header con Avatar (placeholder) y Nombre */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--color-primary)', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          flexShrink: 0
        }}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <Link to={`/users/${user.id}`} style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            {user.name}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <span style={{ color: '#f59e0b', fontSize: '18px' }}>★</span>
            <span style={{ fontWeight: 'bold' }}>{averageScore}</span>
            <span style={{ color: 'var(--color-text-tertiary)', fontSize: '14px', marginLeft: '4px' }}>
              ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px' }}>
        <div style={{ display: 'flex', gap: '8px', color: 'var(--color-text-secondary)' }}>
          <span style={{ width: '80px', fontWeight: '600' }}>Email:</span>
          <span style={{ color: 'var(--color-text-primary)' }}>{user.email}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', color: 'var(--color-text-secondary)' }}>
          <span style={{ width: '80px', fontWeight: '600' }}>Teléfono:</span>
          <span style={{ color: 'var(--color-text-primary)' }}>{user.phone || "No disponible"}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', color: 'var(--color-text-secondary)' }}>
          <span style={{ width: '80px', fontWeight: '600' }}>N. Control:</span>
          <span style={{ color: 'var(--color-text-primary)' }}>{user.ncontrol || "No disponible"}</span>
        </div>
      </div>

      {/* Botón Contactar */}
      {user.phone && (
        <a
          href={`https://wa.me/52${user.phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{
            backgroundColor: '#25D366', // WhatsApp color
            color: 'white',
            width: '100%',
            marginTop: '8px',
            fontSize: '16px',
            padding: '12px'
          }}
        >
          <span style={{ marginRight: '8px' }}>💬</span> Contactar por WhatsApp
        </a>
      )}
    </div>
  );
}
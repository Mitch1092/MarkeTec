import { Link } from "react-router-dom";

export default function UserCard({ user }) {
    // Calcular promedio de scores recibidos
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
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "20px",
                background: "white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                maxWidth: "500px",
                width: "100%",
            }}
        >
            {/* Nombre */}
            <h1
                style={{
                    marginTop: 0,
                    marginBottom: "15px",
                    fontSize: "32px",
                }}
            >
                {/* USUARIO */}

                Usuario:{" "}
                <Link to={`/users/${user.id}`}>
                    {user.name}
                </Link>

            </h1>

            {/* Información */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    fontSize: "16px",
                }}
            >
                <p style={{ margin: 0 }}>
                    <strong>Email:</strong> {user.email}
                </p>

                <p style={{ margin: 0 }}>
                    <strong>Teléfono:</strong> {user.phone || "No disponible"}
                </p>

                <p style={{ margin: 0 }}>
                    <strong>Número de control:</strong>{" "}
                    {user.ncontrol || "No disponible"}
                </p>

                <p
                    style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#2563eb",
                    }}
                >
                    ⭐ Calificación promedio: {averageScore}
                </p>

                <p
                    style={{
                        margin: 0,
                        color: "#666",
                        fontSize: "14px",
                    }}
                >
                    {reviews.length} reseña
                    {reviews.length !== 1 ? "s" : ""}
                </p>

                {user.phone && (
                    <a
                        href={`https://wa.me/52${user.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            marginTop: "10px",
                            display: "inline-block",
                            background: "#25d366",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "bold",
                            textAlign: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                        💬 Contactar
                    </a>
                )}
            </div>
        </div>
    );
}
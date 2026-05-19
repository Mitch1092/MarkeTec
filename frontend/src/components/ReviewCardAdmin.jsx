import { Link } from "react-router-dom";

export default function ReviewCardAdmin({ review }) {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
            }}
        >
            <h3>Score: {review.score}/10</h3>

            <p>{review.description}</p>

            <p>
                Por{" "}
                <Link to={`/users/${review.reviewer.id}`}>
                    {review.reviewer.name}
                </Link>
            </p>

            <p>
                Reseña a:{" "}
                <Link to={`/users/${review.reviewed.id}`}>
                    {review.reviewed.name}
                </Link>
            </p>

            {review.images?.length > 0 && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: "10px",
                        marginTop: "10px",
                    }}
                >
                    {review.images.map((img) => (
                        <img
                            key={img.id}
                            src={`http://localhost:8000/storage/${img.path}`}
                            alt=""
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
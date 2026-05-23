import { Link } from "react-router-dom";

export default function ReportCard({ report }) {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
            }}
        >
            <p>{report.description}</p>

            <p>
                Por{" "}
                <Link to={`/users/${report.reporter.id}`}>
                    {report.reporter.name}
                </Link>
            </p>

            <p>
                Reportando a:{" "}
                <Link to={`/users/${report.reported.id}`}>
                    {report.reported.name}
                </Link>
            </p>

            {report.images?.length > 0 && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: "10px",
                        marginTop: "10px",
                    }}
                >
                    {report.images.map((img) => (
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
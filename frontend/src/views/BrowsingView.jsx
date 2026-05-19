import { useEffect, useMemo, useState } from "react";
import client from "../api/client";
import PostGrid from "../components/PostGrid";

export default function BrowsingView() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("venta"); // "venta" | "compra"

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const res = await client.get("/posts");
    setPosts(res.data);
  };

  // Filtrar posts por pestaña y por título
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filtrar por tipo
      const matchesTab =
        activeTab === "venta"
          ? post.venta === true
          : post.venta === false;

      // Filtrar por título
      const matchesSearch = post.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [posts, activeTab, search]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h1>Explorar publicaciones</h1>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar por título..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "100%",
          maxWidth: "500px",
        }}
      />

      {/* PESTAÑAS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => setActiveTab("venta")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            background:
              activeTab === "venta"
                ? "#2563eb"
                : "#e5e7eb",
            color:
              activeTab === "venta"
                ? "white"
                : "black",
          }}
        >
          Venta
        </button>

        <button
          onClick={() => setActiveTab("compra")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            background:
              activeTab === "compra"
                ? "#f97316"
                : "#e5e7eb",
            color:
              activeTab === "compra"
                ? "white"
                : "black",
          }}
        >
          Compra
        </button>
      </div>

      {/* RESULTADOS */}
      <p
        style={{
          color: "#666",
          margin: 0,
        }}
      >
        {filteredPosts.length} publicaciones encontradas
      </p>

      <PostGrid posts={filteredPosts} />
    </div>
  );
}
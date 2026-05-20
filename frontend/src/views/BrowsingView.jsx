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
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>Explorar Publicaciones</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("venta")}
            className={`btn ${activeTab === "venta" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 20px' }}
          >
            En Venta
          </button>
          
          <button
            onClick={() => setActiveTab("compra")}
            className={`btn ${activeTab === "compra" ? "" : "btn-secondary"}`}
            style={{ 
              borderRadius: 'var(--radius-pill)', 
              padding: '8px 20px',
              backgroundColor: activeTab === "compra" ? 'var(--color-buy)' : '',
              color: activeTab === "compra" ? 'white' : ''
            }}
          >
            Buscando
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <div style={{ position: 'relative', maxWidth: '600px' }}>
        <input
          type="text"
          placeholder="Buscar publicaciones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '40px', borderRadius: 'var(--radius-pill)' }}
        />
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }}>
          🔍
        </span>
      </div>

      {/* RESULTADOS */}
      <div>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: '16px', fontSize: '14px' }}>
          {filteredPosts.length} resultados encontrados
        </p>

        <PostGrid posts={filteredPosts} />
      </div>
    </div>
  );
}
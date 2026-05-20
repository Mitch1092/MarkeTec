import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";
import Toggle from "../components/Toggle";

export default function PostingView() {
  const [venta, setVenta] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [existingImages, setExistingImages] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    images: [],
  });
  useEffect(() => {
    if (isEditing) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    const res = await client.get(`/posts/${id}`);
    const post = res.data;

    setVenta(post.venta);

    setForm({
      title: post.title || "",
      description: post.description || "",
      price: post.price || "",
      images: post.images || [],
    });

    // Guardar imágenes existentes si deseas mostrarlas
    setExistingImages(post.images || []);
  };
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SUBIR IMÁGENES
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    // máximo 8
    const combined = [...form.images, ...files].slice(0, 8);

    setForm({
      ...form,
      images: combined,
    });
  };

  // ELIMINAR IMAGEN
  const removeImage = (index) => {
    const updated = [...form.images];
    updated.splice(index, 1);

    setForm({
      ...form,
      images: updated,
    });
  };

  // MOVER IZQUIERDA
  const moveLeft = (index) => {
    if (index === 0) return;

    const updated = [...form.images];

    [updated[index - 1], updated[index]] = [
      updated[index],
      updated[index - 1],
    ];

    setForm({
      ...form,
      images: updated,
    });
  };

  // MOVER DERECHA
  const moveRight = (index) => {
    if (index === form.images.length - 1) return;

    const updated = [...form.images];

    [updated[index + 1], updated[index]] = [
      updated[index],
      updated[index + 1],
    ];

    setForm({
      ...form,
      images: updated,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("title", form.title);
    data.append("description", form.description);
    data.append("venta", venta ? 1 : 0);
    data.append("price", venta ? form.price : 0);

    form.images.forEach((fileOrImg) => {
      if (fileOrImg.id) {
        data.append("kept_images[]", fileOrImg.id);
      } else {
        data.append("images[]", fileOrImg);
      }
    });
    let res;

    try {
      if (isEditing) {
        data.append("_method", "PUT");
        await client.post(`/posts/${id}`, data);
        alert("Post actualizado");
      } else {
        res = await client.post("/posts", data);
        alert("Post creado");
      }

      setForm({
        title: "",
        description: "",
        price: "",
        images: [],
      });

      navigate(`/posts/${isEditing ? id : res.data.id}`);

    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Error al crear el post. Verifica el tamaño de las imágenes."
      );
    }
  };

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <div className="card" style={{ padding: '32px' }}>
        <h1 style={{ marginTop: 0, marginBottom: '24px' }}>{isEditing ? "Editar Publicación" : "Crear Publicación"}</h1>

        <form onSubmit={handleSubmit} className="flex-col gap-4">
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Título</label>
            <input
              name="title"
              placeholder="Ej. MacBook Pro M1"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Descripción</label>
            <textarea
              name="description"
              placeholder="Describe tu producto..."
              value={form.description}
              onChange={handleChange}
              className="input-field"
              style={{ minHeight: '120px', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ padding: '16px', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-md)' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>Tipo de Publicación</label>
            <Toggle value={venta} onChange={setVenta} />
          </div>

          {venta && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Precio ($)</label>
              <input
                name="price"
                type="number"
                placeholder="Ej. 15000"
                value={form.price}
                onChange={handleChange}
                className="input-field"
                required={venta}
                min="0"
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Imágenes ({form.images.length}/8)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                Seleccionar Archivos
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  style={{ display: 'none' }}
                />
              </label>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Primera imagen será la portada</span>
            </div>
          </div>

          {/* PREVIEW */}
          {form.images.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "16px",
              marginTop: "8px"
            }}>
              {form.images.map((img, index) => (
                <div key={index} style={{
                  position: 'relative',
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-border-light)'
                }}>
                  <img
                    src={img.id ? `http://localhost:8000/storage/${img.path}` : URL.createObjectURL(img)}
                    alt=""
                    style={{
                      width: "100%",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                    }}
                  />

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px",
                    backgroundColor: 'var(--color-surface)',
                    borderTop: '1px solid var(--color-border)'
                  }}>
                    <button type="button" onClick={() => moveLeft(index)} disabled={index === 0} style={{ border: 'none', background: 'none', cursor: 'pointer', opacity: index === 0 ? 0.3 : 1 }}>
                      ⬅️
                    </button>
                    <button type="button" onClick={() => removeImage(index)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-error)' }}>
                      🗑️
                    </button>
                    <button type="button" onClick={() => moveRight(index)} disabled={index === form.images.length - 1} style={{ border: 'none', background: 'none', cursor: 'pointer', opacity: index === form.images.length - 1 ? 0.3 : 1 }}>
                      ➡️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>
              {isEditing ? "Guardar Cambios" : "Publicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
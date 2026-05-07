import { useState } from "react";
import client from "../api/client";
import Toggle from "../components/Toggle";

export default function PostingView() {
  const [venta, setVenta] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    images: [],
  });

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

    form.images.forEach((file) => {
      data.append("images[]", file);
    });

    await client.post("/posts", data);

    alert("Post creado");

    setForm({
      title: "",
      description: "",
      price: "",
      images: [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <h2>Crear post</h2>

      <input
        name="title"
        placeholder="Título"
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
      />

      <Toggle value={venta} onChange={setVenta} />

      {venta && (
        <input
          name="price"
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
        />
      )}

      <div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImages}
        />

        <p>
          {form.images.length}/8 imágenes
        </p>
      </div>

      {/* PREVIEW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "15px",
        }}
      >
        {form.images.map((img, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <img
              src={URL.createObjectURL(img)}
              alt=""
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
                gap: "5px",
              }}
            >
              <button
                type="button"
                onClick={() => moveLeft(index)}
              >
                ←
              </button>

              <button
                type="button"
                onClick={() => moveRight(index)}
              >
                →
              </button>

              <button
                type="button"
                onClick={() => removeImage(index)}
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="submit">
        Crear
      </button>
    </form>
  );
}
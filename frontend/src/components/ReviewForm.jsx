// ReviewForm.jsx
import { useState } from "react";
import client from "../api/client";

export default function ReviewForm({ reviewedId, onCreated }) {
  const [form, setForm] = useState({
    description: "",
    score: 10,
    images: [],
  });

  // CAMBIAR CAMPOS DE TEXTO
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // AGREGAR IMÁGENES (MÁXIMO 8)
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

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

  // MOVER A LA IZQUIERDA
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

  // MOVER A LA DERECHA
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

  // ENVIAR REVIEW
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("reviewed_id", reviewedId);
    data.append("description", form.description);
    data.append("score", form.score);

    form.images.forEach((file) => {
      data.append("images[]", file);
    });

    const res = await client.post("/reviews", data);

    if (onCreated) {
      onCreated(res.data);
    }

    alert("Review enviada");

    setForm({
      description: "",
      score: 10,
      images: [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "700px",
        marginBottom: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <h3>Escribir review</h3>

      <textarea
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
      />

      <div>
        <label>Score (1 a 10)</label>
        <input
          name="score"
          type="number"
          min="1"
          max="10"
          step="0.1"
          value={form.score}
          onChange={handleChange}
        />
      </div>

      {/* SUBIR IMÁGENES */}
      <div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImages}
        />

        <p>{form.images.length}/8 imágenes</p>
      </div>

      {/* PREVIEW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(150px, 1fr))",
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
        Enviar review
      </button>
    </form>
  );
}
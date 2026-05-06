import { useState } from "react";
import client from "../api/client";

export default function PostingView() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  // 📸 Capturar archivo
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // 📝 Crear post + subir imagen
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔹 1. Crear post
      const postRes = await client.post("/api/posts", {
        title,
        description,
        price: parseFloat(price), // importante
        activa: true,
        user_id: 1, // ⚠️ luego lo sacamos del auth
      });

      const postId = postRes.data.id;

      // 🔹 2. Subir imagen
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("post_id", postId);

        await client.post("/api/images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Post creado 🚀");

      // 🧹 limpiar form
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);

    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  return (
    <div>
      <h1>Crear Post</h1>

      <form onSubmit={handleSubmit}>
        
        {/* 📌 Título */}
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 📌 Descripción */}
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* 💲 Precio */}
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* 📸 Imagen */}
        <input type="file" onChange={handleFileChange} />

        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
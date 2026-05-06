import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);

  // 🔹 Obtener usuarios
  const getUsers = async () => {
    const res = await axios.get(API);
    setUsers(res.data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  // 🔹 Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API, form);
    }

    setForm({ name: "", email: "", password: "" });
    getUsers();
  };

  // 🔹 Editar
  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
    });
    setEditingId(user.id);
  };

  // 🔹 Eliminar
  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    getUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CRUD Usuarios</h1>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">
          {editingId ? "Actualizar" : "Crear"}
        </button>
      </form>

      <hr />

      {/* LISTA */}
      {users.map((user) => (
        <div key={user.id}>
          <b>{user.name}</b> - {user.email}
          <br />
          <button onClick={() => handleEdit(user)}>Editar</button>
          <button onClick={() => handleDelete(user.id)}>Eliminar</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
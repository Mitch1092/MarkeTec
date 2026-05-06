import { useState } from "react";
import Input from "./Input";
import Textarea from "./Textarea";
import Button from "./Button";

export default function GenericForm({ fields, onSubmit, title }) {
  const initialState = {};
  fields.forEach(f => (initialState[f.name] = ""));

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(form);
      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{title}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {fields.map((field) => {
        if (field.type === "textarea") {
          return (
            <Textarea
              key={field.name}
              label={field.label}
              value={form[field.name]}
              onChange={(e) =>
                handleChange(field.name, e.target.value)
              }
            />
          );
        }

        return (
          <Input
            key={field.name}
            label={field.label}
            type={field.type || "text"}
            value={form[field.name]}
            onChange={(e) =>
              handleChange(field.name, e.target.value)
            }
          />
        );
      })}

      <Button type="submit">
        {loading ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
}
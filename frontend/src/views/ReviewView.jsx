import GenericForm from "../components/GenericForm";

export default function ReviewView() {
  const fields = [
    { name: "title", label: "Título" },
    { name: "description", label: "Descripción", type: "textarea" },
    { name: "score", label: "Calificación", type: "number" },
  ];

  const handleSubmit = (data) => {
    console.log("POST:", data);
  };

  return (
    <GenericForm
      title="Publicar calificación"
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
}
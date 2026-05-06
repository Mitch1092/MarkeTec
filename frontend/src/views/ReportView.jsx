import GenericForm from "../components/GenericForm";

export default function ReportView() {
  const fields = [
    { name: "description", label: "Descripción", type: "textarea" },
  ];

  const handleSubmit = (data) => {
    console.log("POST:", data);
  };

  return (
    <GenericForm
      title="Crear Reporte"
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
}
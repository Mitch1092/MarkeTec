export default function Textarea({ label, ...props }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      {label && <label >{label}</label>}
      <textarea
        {...props}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}
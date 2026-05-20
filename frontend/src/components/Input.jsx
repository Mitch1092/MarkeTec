export default function Input({ label, id, ...props }) {
  return (
    <div style={{ marginBottom: "16px", width: "100%" }}>
      {label && <label htmlFor={id} style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>{label}</label>}
      <input id={id} className="input-field" {...props} />
    </div>
  );
}
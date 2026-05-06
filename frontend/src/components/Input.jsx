export default function Input({ label, id, ...props }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} {...props} />
    </div>
  );
}
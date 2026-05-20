export default function Button({ children, onClick, type = "button", variant = "primary", style = {} }) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`btn btn-${variant}`}
      style={{ width: "100%", ...style }}
    >
      {children}
    </button>
  );
}
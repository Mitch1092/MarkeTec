import { useState } from "react";

export default function ToggleAdmin({ value, onChange }) {
    const [enabled, setEnabled] = useState(value ?? false);

    const toggle = () => {
        const newValue = !enabled;
        setEnabled(newValue);
        onChange(newValue);
    };

    return (
        <div style={styles.wrapper}>
            <span style={{ marginRight: "10px" }}>
                {enabled ? "Activos" : "Desactivados"}
            </span>

            <button
                type="button"
                onClick={toggle}
                style={{
                    ...styles.button,
                    background: enabled ? "#22c55e" : "#e5e7eb",
                    color: enabled ? "white" : "black",
                }}
            >
                {enabled ? "ON" : "OFF"}
            </button>
        </div>
    );
}

const styles = {
    wrapper: {
        display: "flex",
        alignItems: "center",
        margin: "10px 0",
    },
    button: {
        padding: "6px 14px",
        borderRadius: "20px",
        border: "none",
        cursor: "pointer",
        transition: "0.2s",
    },
};
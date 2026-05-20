import { useState, useEffect } from "react";

export default function Toggle({ value, onChange }) {
  const [enabled, setEnabled] = useState(value ?? true);

  useEffect(() => {
    setEnabled(value ?? true);
  }, [value]);

  const toggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    onChange(newValue);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '8px 0' }}>
      
      {/* Etiqueta Visual */}
      <span style={{ 
        fontWeight: 'bold', 
        fontSize: '16px',
        color: enabled ? 'var(--color-sale)' : 'var(--color-buy)',
        width: '120px'
      }}>
        {enabled ? "Venta 💰" : "Buscando 📝"}
      </span>

      {/* Switch Background */}
      <div 
        onClick={toggle}
        style={{
          width: '56px',
          height: '32px',
          backgroundColor: enabled ? 'var(--color-sale)' : 'var(--color-buy)',
          borderRadius: 'var(--radius-pill)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
      >
        {/* Switch Knob */}
        <div style={{
          width: '24px',
          height: '24px',
          backgroundColor: 'white',
          borderRadius: '50%',
          position: 'absolute',
          top: '4px',
          left: enabled ? '28px' : '4px',
          transition: 'left 0.3s cubic-bezier(0.2, 0.85, 0.32, 1.2)',
          boxShadow: 'var(--shadow-sm)'
        }}></div>
      </div>
    </div>
  );
}
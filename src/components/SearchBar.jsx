import { useState } from "react";

// SearchBar recibe dos props:
// - onSearch: función que le avisa al padre (App.jsx) qué escribió el usuario
// - currency: moneda seleccionada actualmente
// - onCurrencyChange: función que le avisa al padre cuando cambia la moneda
function SearchBar({ onSearch, currency, onCurrencyChange }) {
  // Guardamos el texto del input en estado local
  const [query, setQuery] = useState("");

  // Cada vez que el usuario escribe, actualizamos el estado
  // y le avisamos al padre con onSearch para que filtre las coins
  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "1.5rem",
      }}
    >
      {/* Input de búsqueda — filtra por nombre o símbolo */}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar cripto... (ej: bitcoin, eth)"
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "8px",
          border: "0.5px solid #e5e5e5",
          fontSize: "14px",
          outline: "none",
        }}
      />

      {/* Selector de moneda — cambia el precio mostrado en todas las cards */}
      <select
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        style={{
          padding: "10px 12px",
          borderRadius: "8px",
          border: "0.5px solid #e5e5e5",
          fontSize: "14px",
          background: "white",
          cursor: "pointer",
          width: "110px",
        }}
      >
        <option value="usd">USD $</option>
        <option value="eur">EUR €</option>
        <option value="ars">ARS $</option>
      </select>
    </div>
  );
}

export default SearchBar;

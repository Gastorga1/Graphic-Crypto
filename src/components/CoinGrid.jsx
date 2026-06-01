// CoinGrid es el contenedor de todas las CoinCards
// Su trabajo es recibir la lista de coins ya filtrada y renderizarlas
// También maneja el estado de loading y error para no ensuciar App.jsx
function CoinGrid({ coins, loading, error, selected, onSelect }) {
  // Si está cargando, mostramos un mensaje simple
  // Más adelante podés reemplazar esto por un skeleton loader
  if (loading) {
    return (
      <p style={{ color: "#888", fontSize: "14px", padding: "2rem 0" }}>
        Cargando criptomonedas...
      </p>
    );
  }

  // Si la API devolvió un error, lo mostramos
  if (error) {
    return (
      <p style={{ color: "#D85A30", fontSize: "14px", padding: "2rem 0" }}>
        {error}
      </p>
    );
  }

  return (
    <div>
      {/* Cantidad de resultados — útil cuando el usuario está buscando */}
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "12px" }}>
        {coins.length} criptomonedas
      </p>

      {/* Grid responsivo — en pantallas chicas 1 columna, en grandes hasta 4 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        {coins.map((coin) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            isSelected={selected === coin.id}
            onClick={() => onSelect(coin.id)}
          />
        ))}
      </div>

      {/* Mensaje si el filtro no encontró nada */}
      {coins.length === 0 && (
        <p style={{ color: "#888", fontSize: "14px", marginTop: "1rem" }}>
          No se encontró ninguna cripto con ese nombre.
        </p>
      )}
    </div>
  );
}

// Importamos CoinCard acá adentro porque CoinGrid es su único consumidor
import CoinCard from "./CoinCard";

export default CoinGrid;

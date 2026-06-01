// src/components/StatsPanel.jsx

// StatsPanel recibe la coin completa (el objeto entero, no solo el id)
// para poder mostrar todos sus datos sin hacer otra llamada a la API
function StatsPanel({ coin }) {
  // Si no hay coin seleccionada no renderizamos nada
  if (!coin) return null;

  // Formatea números grandes con sufijos K, M, B, T
  // Sirve para market cap y volumen que son números enormes
  const formatLargeNumber = (num) => {
    if (num >= 1_000_000_000_000)
      return "$" + (num / 1_000_000_000_000).toFixed(2) + "T";
    if (num >= 1_000_000_000)
      return "$" + (num / 1_000_000_000).toFixed(2) + "B";
    if (num >= 1_000_000) return "$" + (num / 1_000_000).toFixed(2) + "M";
    return "$" + num.toLocaleString("en-US");
  };

  // Formatea el precio según su magnitud
  const formatPrice = (price) => {
    if (!price) return "—";
    if (price >= 1000)
      return "$" + price.toLocaleString("en-US", { maximumFractionDigits: 0 });
    if (price >= 1) return "$" + price.toFixed(2);
    return "$" + price.toFixed(4);
  };

  // Determina si la variación es positiva o negativa para el color
  const isPositive = coin.price_change_percentage_24h >= 0;

  // Array de stats — fácil de extender si querés agregar más datos
  const stats = [
    {
      label: "Precio actual",
      value: formatPrice(coin.current_price),
    },
    {
      label: "Máximo 24h",
      value: formatPrice(coin.high_24h),
      // Color verde si el precio actual está cerca del máximo
      color: "#1D9E75",
    },
    {
      label: "Mínimo 24h",
      value: formatPrice(coin.low_24h),
      // Color rojo para el mínimo
      color: "#D85A30",
    },
    {
      label: "Variación 24h",
      // Agregamos el signo + manualmente para valores positivos
      value:
        (isPositive ? "+" : "") +
        coin.price_change_percentage_24h.toFixed(2) +
        "%",
      color: isPositive ? "#1D9E75" : "#D85A30",
    },
    {
      label: "Market Cap",
      value: formatLargeNumber(coin.market_cap),
    },
    {
      label: "Volumen 24h",
      // Volumen total de transacciones en las últimas 24 horas
      value: formatLargeNumber(coin.total_volume),
    },
  ];

  return (
    <div style={{ marginTop: "1.5rem" }}>
      {/* Header con logo y nombre de la coin seleccionada */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "1rem",
        }}
      >
        <img
          src={coin.image}
          alt={coin.name}
          width={28}
          height={28}
          style={{ borderRadius: "50%" }}
        />
        <p style={{ fontSize: "15px", fontWeight: 500 }}>
          {coin.name}
          <span
            style={{
              color: "#888",
              fontWeight: 400,
              marginLeft: "6px",
              fontSize: "13px",
            }}
          >
            {coin.symbol.toUpperCase()}
          </span>
        </p>

        {/* Ranking por market cap */}
        <span
          style={{
            fontSize: "11px",
            background: "#f5f5f5",
            color: "#888",
            borderRadius: "20px",
            padding: "2px 8px",
            marginLeft: "auto",
          }}
        >
          Rank #{coin.market_cap_rank}
        </span>
      </div>

      {/* Grid de stats — 3 columnas en desktop, 2 en mobile */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "10px",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#f9f9f9",
              borderRadius: "10px",
              padding: "0.75rem 1rem",
            }}
          >
            {/* Etiqueta — texto secundario pequeño */}
            <p style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>
              {stat.label}
            </p>

            {/* Valor — con color opcional si se definió en el array */}
            <p
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: stat.color || "#111",
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsPanel;

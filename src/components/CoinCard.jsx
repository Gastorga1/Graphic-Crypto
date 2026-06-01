// src/components/CoinCard.jsx

function CoinCard({ coin, isSelected, onClick }) {
  const isPositive = coin.price_change_percentage_24h >= 0;

  const formatPrice = (price) => {
    if (price >= 1000)
      return "$" + price.toLocaleString("en-US", { maximumFractionDigits: 0 });
    if (price >= 1) return "$" + price.toFixed(2);
    return "$" + price.toFixed(4);
  };

  const formatMarketCap = (cap) => {
    if (cap >= 1_000_000_000_000)
      return "$" + (cap / 1_000_000_000_000).toFixed(2) + "T";
    if (cap >= 1_000_000_000)
      return "$" + (cap / 1_000_000_000).toFixed(1) + "B";
    return "$" + (cap / 1_000_000).toFixed(0) + "M";
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        border: isSelected ? "2px solid #378ADD" : "0.5px solid #e5e5e5",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        cursor: "pointer",
        transition: "border-color 0.15s, transform 0.1s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Header: logo + nombre */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <img
          src={coin.image}
          alt={coin.name}
          width={36}
          height={36}
          style={{ borderRadius: "50%" }}
        />
        <div>
          <div style={{ fontSize: "14px", fontWeight: 500 }}>{coin.name}</div>
          <div
            style={{
              fontSize: "11px",
              color: "#888",
              textTransform: "uppercase",
            }}
          >
            {coin.symbol}
          </div>
        </div>

        {/* Rank badge */}
        <div
          style={{
            marginLeft: "auto",
            fontSize: "11px",
            color: "#888",
            background: "#f5f5f5",
            borderRadius: "20px",
            padding: "2px 8px",
          }}
        >
          #{coin.market_cap_rank}
        </div>
      </div>

      {/* Precio */}
      <div style={{ fontSize: "20px", fontWeight: 500, marginBottom: "4px" }}>
        {formatPrice(coin.current_price)}
      </div>

      {/* Variación 24h */}
      <div
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: isPositive ? "#1D9E75" : "#D85A30",
          marginBottom: "10px",
        }}
      >
        {isPositive ? "▲" : "▼"}{" "}
        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}% hoy
      </div>

      {/* Market cap */}
      <div
        style={{
          fontSize: "12px",
          color: "#888",
          borderTop: "0.5px solid #f0f0f0",
          paddingTop: "8px",
        }}
      >
        Mkt cap: {formatMarketCap(coin.market_cap)}
      </div>
    </div>
  );
}

export default CoinCard;

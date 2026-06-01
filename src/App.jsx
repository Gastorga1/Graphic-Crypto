// src/App.jsx

import { useState } from "react";
import useCryptoData from "./hooks/useCryptoData";
import SearchBar from "./components/SearchBar";
import CoinGrid from "./components/CoinGrid";
import PriceChart from "./components/PriceChart";
import StatsPanel from "./components/StatsPanel";

function App() {
  const [query, setQuery] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [selected, setSelected] = useState(null);

  const { coins, loading, error } = useCryptoData(currency);

  const filtered = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase()),
  );

  const selectedCoin = coins.find((coin) => coin.id === selected) || null;

  return (
    <div style={{ minHeight: "100vh", padding: "0 0 4rem" }}>
      {/* Header superior — franja oscura con título y descripción */}
      <header
        style={{
          background: "#111",
          color: "white",
          padding: "1.5rem 2rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          {/* Logo + título en la misma línea */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#F7931A", // color naranja de Bitcoin
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              ₿
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: 500 }}>
              Crypto Tracker
            </h1>
          </div>

          <p style={{ fontSize: "13px", color: "#888" }}>
            Top 20 criptomonedas · Datos en tiempo real · CoinGecko API
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "0 2rem" }}>
        <SearchBar
          onSearch={setQuery}
          currency={currency}
          onCurrencyChange={setCurrency}
        />

        <CoinGrid
          coins={filtered}
          loading={loading}
          error={error}
          selected={selected}
          onSelect={setSelected}
        />

        {/* Sección de detalle — solo visible cuando hay una coin seleccionada */}
        {selectedCoin && (
          <div
            style={{
              marginTop: "2rem",
              background: "white",
              borderRadius: "16px",
              border: "0.5px solid #e5e5e5",
              padding: "1.5rem",
            }}
          >
            <StatsPanel coin={selectedCoin} />
            <PriceChart coinId={selected} currency={currency} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          marginTop: "4rem",
          fontSize: "12px",
          color: "#aaa",
        }}
      >
        Datos provistos por{" "}
        <a
          href="https://www.coingecko.com"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#378ADD", textDecoration: "none" }}
        >
          CoinGecko
        </a>{" "}
        · Actualización automática cada 60s
      </footer>
    </div>
  );
}

export default App;

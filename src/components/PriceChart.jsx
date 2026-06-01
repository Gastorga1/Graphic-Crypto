// src/components/PriceChart.jsx

import { useState, useEffect } from "react";
import axios from "axios";
// LineChart y sus partes vienen de recharts — la librería de gráficos que instalamos
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BASE_URL = "https://api.coingecko.com/api/v3";

// coinId: el id de la coin seleccionada (ej: "bitcoin", "ethereum")
// currency: moneda actual (usd, eur, ars)
function PriceChart({ coinId, currency }) {
  // Los puntos del gráfico — cada uno tiene una fecha y un precio
  const [chartData, setChartData] = useState([]);

  // Días de historial a mostrar — el usuario puede cambiarlo con los botones
  const [days, setDays] = useState(7);

  // Loading y error propios del gráfico, independientes del hook principal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si no hay coin seleccionada no hacemos nada
    if (!coinId) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);

        // Endpoint diferente al de useCryptoData — este trae el historial
        // de precios de UNA coin específica para el período elegido
        const { data } = await axios.get(
          `${BASE_URL}/coins/${coinId}/market_chart`,
          {
            params: {
              vs_currency: currency,
              days: days, // 7, 30 o 90 días según el botón activo
            },
          },
        );

        // CoinGecko devuelve los precios así:
        // { prices: [[timestamp, precio], [timestamp, precio], ...] }
        // Lo transformamos a un formato que recharts pueda leer
        const formatted = data.prices.map(([timestamp, price]) => ({
          // Convertimos el timestamp a una fecha legible
          date: new Date(timestamp).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
          }),
          // Redondeamos el precio para evitar decimales infinitos
          price: parseFloat(price.toFixed(2)),
        }));

        setChartData(formatted);
        setError(null);
      } catch (err) {
        setError("No se pudo cargar el historial de precios.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    // Se re-ejecuta si cambia la coin, la moneda o el período
  }, [coinId, currency, days]);

  // Formateador para el eje Y y el tooltip — muestra el precio con símbolo
  const formatPrice = (value) => {
    if (value >= 1000)
      return "$" + value.toLocaleString("en-US", { maximumFractionDigits: 0 });
    if (value >= 1) return "$" + value.toFixed(2);
    return "$" + value.toFixed(4);
  };

  // Si no hay coin seleccionada mostramos un mensaje invitando a elegir
  if (!coinId) {
    return (
      <div
        style={{
          background: "white",
          border: "0.5px solid #e5e5e5",
          borderRadius: "12px",
          padding: "2rem",
          textAlign: "center",
          color: "#888",
          fontSize: "14px",
          marginTop: "1.5rem",
        }}
      >
        Seleccioná una criptomoneda para ver su historial de precios
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        border: "0.5px solid #e5e5e5",
        borderRadius: "12px",
        padding: "1.25rem",
        marginTop: "1.5rem",
      }}
    >
      {/* Header del gráfico — título y botones de período */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <p style={{ fontSize: "15px", fontWeight: 500 }}>
          Historial de precios
        </p>

        {/* Botones para cambiar el período — actualizan el estado days */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              style={{
                padding: "4px 12px",
                borderRadius: "8px",
                border: "0.5px solid #e5e5e5",
                background: days === d ? "#f0f0f0" : "white",
                fontWeight: days === d ? 500 : 400,
                fontSize: "12px",
                cursor: "pointer",
                color: days === d ? "#111" : "#888",
              }}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <p style={{ color: "#888", fontSize: "13px", padding: "1rem 0" }}>
          Cargando historial...
        </p>
      )}

      {/* Estado de error */}
      {error && (
        <p style={{ color: "#D85A30", fontSize: "13px", padding: "1rem 0" }}>
          {error}
        </p>
      )}

      {/* El gráfico — solo se muestra cuando hay datos */}
      {!loading && !error && (
        // ResponsiveContainer hace que el gráfico se adapte al ancho del contenedor
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            {/* Eje X — muestra las fechas, solo algunas para no saturar */}
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#888" }}
              interval={Math.floor(chartData.length / 6)}
            />

            {/* Eje Y — muestra los precios formateados */}
            <YAxis
              tick={{ fontSize: 11, fill: "#888" }}
              tickFormatter={formatPrice}
              width={70}
              domain={["auto", "auto"]}
            />

            {/* Tooltip — aparece al hacer hover, muestra fecha y precio */}
            <Tooltip
              formatter={(value) => [formatPrice(value), "Precio"]}
              labelStyle={{ fontSize: "12px", color: "#888" }}
              contentStyle={{
                borderRadius: "8px",
                border: "0.5px solid #e5e5e5",
                fontSize: "13px",
              }}
            />

            {/* La línea del gráfico — usa el campo price de cada punto */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#378ADD"
              strokeWidth={2}
              dot={false} // sin puntos en cada dato — se ve más limpio
              activeDot={{ r: 4 }} // solo aparece un punto al hacer hover
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default PriceChart;

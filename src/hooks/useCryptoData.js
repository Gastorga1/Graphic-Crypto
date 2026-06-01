// src/hooks/useCryptoData.js

import { useState, useEffect } from "react";
import axios from "axios";

// URL base de CoinGecko — gratis, sin necesidad de API key
const BASE_URL = "https://api.coingecko.com/api/v3";

// currency: la moneda en que queremos los precios (usd, eur, ars)
function useCryptoData(currency = "usd") {
  // Lista de coins que vienen de la API
  const [coins, setCoins] = useState([]);

  // true mientras espera la respuesta — sirve para mostrar el loader
  const [loading, setLoading] = useState(true);

  // Guarda el mensaje de error si algo falla
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función que hace el fetch — la definimos adentro para poder llamarla
    // también desde el setInterval más abajo
    const fetchCoins = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(`${BASE_URL}/coins/markets`, {
          params: {
            vs_currency: currency, // moneda seleccionada por el usuario
            order: "market_cap_desc", // ordena de mayor a menor capitalización
            per_page: 20, // traemos las top 20
            page: 1,
            sparkline: false, // no necesitamos el mini gráfico acá
          },
        });

        setCoins(data);
        setError(null); // limpiamos errores anteriores si ahora funcionó
      } catch (err) {
        // CoinGecko tiene límite de requests en el plan gratis
        // si se pasa, devuelve 429 — lo avisamos al usuario
        if (err.response?.status === 429) {
          setError("Demasiadas solicitudes. Esperá un momento y recargá.");
        } else {
          setError("Error al cargar los datos. Revisá tu conexión.");
        }
      } finally {
        // loading en false siempre, haya funcionado o no
        setLoading(false);
      }
    };

    // Llamada inicial cuando el componente monta o cambia la moneda
    fetchCoins();

    // Refresca los precios cada 60 segundos automáticamente
    const interval = setInterval(fetchCoins, 60000);

    // Cleanup: cancela el interval si el componente se desmonta
    // evita memory leaks y llamadas a la API innecesarias
    return () => clearInterval(interval);
  }, [currency]); // se re-ejecuta cada vez que cambia la moneda

  // Devolvemos lo que necesitan los componentes
  return { coins, loading, error };
}

export default useCryptoData;

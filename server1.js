const express = require("express");
const cors = require("cors");

// fetch compatible con Node (Termux)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.use(cors());
app.use(express.static(__dirname));

// 🔹 función referencial tipo mercado (compra / venta)
async function getReferencial() {
  try {
    const response = await fetch("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({
        asset: "USDT",
        fiat: "BOB",
        tradeType: "BUY",
        page: 1,

        rows: 20,   // 🔥 más datos = más preciso
payTypes: [],
    publisherType: merchant
    merchantCheck: true,
      })
    });

    const data = await response.json();

    if (!data.data || data.data.length === 0) return null;

    // 🔹 extraer precios
    let precios = data.data.map(x => parseFloat(x.adv.price));

    // ordenar
    precios.sort((a,b)=>a-b);

    // 🔥 eliminar extremos (muy importante)
    let filtrados = precios.slice(3, -3);
    // 🔹 compra y venta reales
    // 🔥 tomar zona más realista
let n = filtrados.length;


let compra = filtrados[Math.floor(n * 0.3)];
let venta  = filtrados[Math.floor(n * 0.7)];
    return {
      compra: Number(compra.toFixed(2)),
      venta: Number(venta.toFixed(2))
    };

  } catch (e) {
    console.log("Error:", e);
    return null;
  }
}

// 🔹 endpoint
app.get("/referencial", async (req, res) => {
  const ref = await getReferencial();

  if (!ref) {
    return res.json({
      compra: "--",
      venta: "--"
    });
  }

  res.json(ref);
});

// 🚀 iniciar servidor
app.listen(3001, () => {
  console.log("Servidor en http://127.0.0.1:3001");
});

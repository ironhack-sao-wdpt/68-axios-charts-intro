import { useEffect, useState } from "react";

import Chart from "chart.js/auto";
import axios from "axios";

function MyChart() {
  const [dates, setDates] = useState([]);
  const [closingPrices, setClosingPrices] = useState([]);
  const [chart, setChart] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo"
        );

        // 1. Extrair somentes as chaves do objeto "Time Series (Daily)" e colocar no state 'dates'

        // O método entries retorna uma matriz: uma array onde cada par de chave:valor do objeto se transforma em outra array, onde o index 0 é a chave, e o índice 1 é o valor.
        // [[chave, valor], [chave, valor]]
        const entries = Object.entries(response.data["Time Series (Daily)"]);

        // Ordena pela data
        entries.sort((a, b) => {
          return new Date(a[0]) - new Date(b[0]);
        });
        console.log(entries);

        // Setamos o state para somente a data
        setDates(entries.map((currentArr) => currentArr[0]));

        // 2. Para cada valor de cada chave desse objeto, extrair a chave "4. close" e colocar no state 'closingPrices'

        // Setamos o state para somente a chave de valor de fechamento do objeto
        setClosingPrices(
          entries.map((currentArr) => currentArr[1]["4. close"])
        );
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const ctx = document.getElementById("myChart");

    // Limpa o gráfico atual antes de tentar desenhar um novo
    if (chart) {
      chart.destroy();
    }

    // Preenchendo um novo gráfico com os valores atualizados
    const myChart = new Chart(ctx, {
      type: "line",
      responsive: true,
      maintainAspectRatio: false,
      data: {
        labels: dates,
        datasets: [
          {
            label: "Variação de preço ação $MSFT",
            data: closingPrices,
            fill: true,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgb(75, 192, 192)",
            tension: 0,
          },
        ],
      },
    });

    // Atualiza o state para conter a referência mais atual do gráfico
    setChart(myChart);
  }, [dates, closingPrices]);

  return (
    <div style={{ position: "relative", height: "30vh" }}>
      <canvas id="myChart" width="400" height="400"></canvas>
    </div>
  );
}

export default MyChart;

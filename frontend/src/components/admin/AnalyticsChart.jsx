import { useMemo, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function AnalyticsChart({ history }) {

  const [range, setRange] = useState("7");

  const chartData = useMemo(() => {

    let data = [...history];

    if (range === "7") {
      data = data.slice(-7);
    }

    if (range === "30") {
      data = data.slice(-30);
    }

    return data;

  }, [history, range]);

  const labels = chartData.map(i => i.date);

  return (

    <div className="analytics-chart">

      <div className="analytics-header">

        <h2>📈 Website Analytics</h2>

        <div className="analytics-filter">

          <button
            className={range === "7" ? "active" : ""}
            onClick={() => setRange("7")}
          >
            7 Days
          </button>

          <button
            className={range === "30" ? "active" : ""}
            onClick={() => setRange("30")}
          >
            30 Days
          </button>

          <button
            className={range === "all" ? "active" : ""}
            onClick={() => setRange("all")}
          >
            All
          </button>

        </div>

      </div>

      <Line
        data={{

          labels,

          datasets: [

            {
              label: "Page Views",

              data: chartData.map(i => i.pageViews),

              borderColor: "#4FC3F7",

              backgroundColor: "rgba(79,195,247,.18)",

              fill: true,

              tension: .35,
            },

            {
              label: "Visitors",

              data: chartData.map(i => i.uniqueVisitors),

              borderColor: "#AB47BC",

              backgroundColor: "rgba(171,71,188,.18)",

              fill: true,

              tension: .35,
            },

            {
              label: "Movie Views",

              data: chartData.map(i => i.movieViews),

              borderColor: "#66BB6A",

              backgroundColor: "rgba(102,187,106,.18)",

              fill: true,

              tension: .35,
            },

          ],

        }}

        options={{

          responsive: true,

          interaction: {
            intersect: false,
            mode: "index",
          },

          plugins: {

            legend: {

              labels: {

                color: "#fff",

                font: {
                  size: 13,
                }

              }

            }

          },

          scales: {

            x: {

              ticks: {

                color: "#aaa",

              },

              grid: {

                color: "#2f2f2f",

              }

            },

            y: {

              ticks: {

                color: "#aaa",

              },

              grid: {

                color: "#2f2f2f",

              }

            }

          }

        }}

      />

    </div>

  );

}

export default AnalyticsChart;
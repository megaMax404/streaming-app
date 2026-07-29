import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function AnalyticsChart({ history }) {

    const labels =
        history.map(item => item.date);

    const pageViews =
        history.map(item => item.pageViews);

    const visitors =
        history.map(item => item.uniqueVisitors);

    const movieViews =
        history.map(item => item.movieViews);

    const data = {

        labels,

        datasets: [

            {
                label: "Page Views",
                data: pageViews,
                borderColor: "#4FC3F7",
                backgroundColor: "rgba(79,195,247,.2)",
                tension: .35,
            },

            {
                label: "Visitors",
                data: visitors,
                borderColor: "#AB47BC",
                backgroundColor: "rgba(171,71,188,.2)",
                tension: .35,
            },

            {
                label: "Movie Views",
                data: movieViews,
                borderColor: "#66BB6A",
                backgroundColor: "rgba(102,187,106,.2)",
                tension: .35,
            },

        ],
    };

    const options = {

        responsive: true,

        plugins: {

            legend: {

                labels: {

                    color: "#fff"

                }

            }

        },

        scales: {

            x: {

                ticks: {

                    color: "#aaa"

                },

                grid: {

                    color: "#333"

                }

            },

            y: {

                ticks: {

                    color: "#aaa"

                },

                grid: {

                    color: "#333"

                }

            }

        }

    };

    return (

        <div className="analytics-chart">

            <h3>📈 Website Analytics (7 Days)</h3>

            <Line
                data={data}
                options={options}
            />

        </div>

    );

}

export default AnalyticsChart;
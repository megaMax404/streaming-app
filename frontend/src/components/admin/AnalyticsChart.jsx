import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function AnalyticsChart({ data }) {
  return (
    <div className="analytics-chart">

      <h3>📈 Website Analytics</h3>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="pageViews"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Page Views"
          />

          <Line
            type="monotone"
            dataKey="movieViews"
            stroke="#ef4444"
            strokeWidth={3}
            name="Movie Views"
          />

          <Line
            type="monotone"
            dataKey="uniqueVisitors"
            stroke="#10b981"
            strokeWidth={3}
            name="Visitors"
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default AnalyticsChart;
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";

const MetricsChart = ({ data }) => {
  return (
    <div className="charts-container">
      <div className="chart">
        <h3>CPU & Memory Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12 }}
              interval={Math.floor(data.length / 5)}
            />
            <YAxis yAxisId="left" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cpu_usage"
              stroke="#ff7300"
              name="CPU %"
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="memory_usage"
              stroke="#8884d8"
              name="Memory %"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart">
        <h3>Request Rate & Response Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12 }}
              interval={Math.floor(data.length / 5)}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="requests_per_sec"
              fill="#82ca9d"
              name="Req/sec"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="response_time_ms"
              stroke="#ffc658"
              name="Response Time (ms)"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="chart">
        <h3>Error Rate Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12 }}
              interval={Math.floor(data.length / 5)}
            />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="error_rate"
              stroke="#d62728"
              name="Error Rate %"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;

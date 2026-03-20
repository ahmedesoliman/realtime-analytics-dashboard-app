import React, { useState, useEffect } from "react";
import "./App.css";
import MetricsChart from "./components/MetricsChart";

const API = "ws://localhost:8001/ws";

function App() {
  const [metrics, setMetrics] = useState(null);
  const [connected, setConnected] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(API);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "metrics") {
        setMetrics(data.data);
        setHistory((prev) => [...prev.slice(-59), data.data]);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      setConnected(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => ws.close();
  }, []);

  if (!metrics) {
    return (
      <div className="container">
        <h1>Real-Time Analytics Dashboard</h1>
        <div className="status">
          <p
            className={`connection-status ${connected ? "connected" : "disconnected"}`}
          >
            {connected ? "🟢 Connected" : "🔴 Disconnected"}
          </p>
          <p>Connecting to server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Real-Time Analytics Dashboard</h1>

      <div
        className={`status connection-status ${connected ? "connected" : "disconnected"}`}
      >
        {connected ? "🟢 Live" : "🔴 Offline"}
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">CPU Usage</div>
          <div className="metric-value">{metrics.cpu_usage}%</div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{ width: `${metrics.cpu_usage}%` }}
            ></div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Memory Usage</div>
          <div className="metric-value">{metrics.memory_usage}%</div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{ width: `${metrics.memory_usage}%` }}
            ></div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Requests/sec</div>
          <div className="metric-value">{metrics.requests_per_sec}</div>
          <div className="metric-info">current throughput</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Response Time</div>
          <div className="metric-value">{metrics.response_time_ms}ms</div>
          <div className="metric-info">avg latency</div>
        </div>
      </div>

      <div className="error-rate-section">
        <div className="metric-label">Error Rate</div>
        <div
          className={`error-rate-value ${metrics.error_rate > 5 ? "high" : "normal"}`}
        >
          {metrics.error_rate}%
        </div>
      </div>

      {history.length > 0 && (
        <div className="charts-section">
          <MetricsChart data={history} />
        </div>
      )}

      <div className="timestamp">
        Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}

export default App;

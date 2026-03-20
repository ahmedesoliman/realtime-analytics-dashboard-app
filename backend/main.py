"""
Real-Time Analytics Dashboard - FastAPI Backend
WebSocket streaming for live metrics
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import asyncio
import json
import random
from datetime import datetime

app = FastAPI(title="Real-Time Analytics Dashboard", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass


manager = ConnectionManager()


class MetricsGenerator:
    """Generate simulated real-time metrics"""
    
    def __init__(self):
        self.cpu_usage = 45
        self.memory_usage = 60
        self.requests_per_sec = 150
        self.response_time = 200
        self.error_rate = 2
    
    def generate_metrics(self):
        """Generate next metric values"""
        # CPU usage with trend
        self.cpu_usage += random.uniform(-5, 8)
        self.cpu_usage = max(0, min(100, self.cpu_usage))
        
        # Memory usage with trend
        self.memory_usage += random.uniform(-3, 5)
        self.memory_usage = max(0, min(100, self.memory_usage))
        
        # Requests per second
        self.requests_per_sec += random.uniform(-50, 100)
        self.requests_per_sec = max(0, self.requests_per_sec)
        
        # Response time in ms
        self.response_time += random.uniform(-20, 30)
        self.response_time = max(100, self.response_time)
        
        # Error rate percentage
        self.error_rate += random.uniform(-0.5, 1.5)
        self.error_rate = max(0, min(10, self.error_rate))
        
        return {
            "timestamp": datetime.now().isoformat(),
            "cpu_usage": round(self.cpu_usage, 2),
            "memory_usage": round(self.memory_usage, 2),
            "requests_per_sec": round(self.requests_per_sec, 2),
            "response_time_ms": round(self.response_time, 2),
            "error_rate": round(self.error_rate, 2),
        }


metrics_gen = MetricsGenerator()


@app.get("/")
async def root():
    return {
        "name": "Real-Time Analytics Dashboard",
        "version": "1.0.0",
        "endpoints": ["/metrics", "/ws"]
    }


@app.get("/metrics")
async def get_latest_metrics():
    """Get current metrics"""
    return metrics_gen.generate_metrics()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for streaming metrics"""
    await manager.connect(websocket)
    try:
        while True:
            # Generate metrics every second
            await asyncio.sleep(1)
            metrics = metrics_gen.generate_metrics()
            
            # Broadcast to all connected clients
            await manager.broadcast({
                "type": "metrics",
                "data": metrics
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

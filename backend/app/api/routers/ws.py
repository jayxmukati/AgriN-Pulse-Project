from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()

@router.websocket("/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Wait 10 seconds before simulating the outbreak alert

        # Simulate an incoming outbreak alert after 10 seconds
        await asyncio.sleep(10)
        outbreak_alert = {
            "type": "alert",
            "level": "critical",
            "title": "Disease Outbreak Detected",
            "message": "High confidence pattern of Wheat Rust detected in your registered H3 Geo-region (GEO-8860144aa7fffff)."
        }
        await websocket.send_text(json.dumps(outbreak_alert))
        
        while True:
            data = await websocket.receive_text()
            # We can handle incoming client messages here if needed
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

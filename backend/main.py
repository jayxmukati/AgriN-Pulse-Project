from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import fields, analytics, diagnose, advisories, voice, export, auth, news, ws, calendar, forum

app = FastAPI(title="BRICS AgriN-Pulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fields.router, prefix="/api/v1/fields", tags=["Fields"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(news.router, prefix="/api/v1/news", tags=["News"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(diagnose.router, prefix="/api/v1/diagnose", tags=["Diagnose"])
app.include_router(advisories.router, prefix="/api/v1/advisories", tags=["Advisories"])
app.include_router(voice.router, prefix="/api/v1/voice", tags=["Voice"])
app.include_router(export.router, prefix="/api/v1/export", tags=["Export"])
app.include_router(calendar.router, prefix="/api/v1/calendar", tags=["Calendar"])
app.include_router(forum.router, prefix="/api/v1/forum", tags=["Forum"])
app.include_router(ws.router, prefix="/ws", tags=["WebSockets"])

@app.get("/")
def read_root():
    return {"message": "Welcome to BRICS AgriN-Pulse API"}

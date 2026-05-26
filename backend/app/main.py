from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import weather

app = FastAPI(title="Barograph API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router, prefix="/api/v1/weather")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "barograph"}

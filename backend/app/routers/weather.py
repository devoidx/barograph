from fastapi import APIRouter, HTTPException

from app.services.open_meteo import get_air_quality, get_forecast, get_marine

router = APIRouter()


@router.get("/current")
async def current_weather(lat: float, lon: float) -> dict:
    try:
        forecast = await get_forecast(lat, lon)
        air = await get_air_quality(lat, lon)
        return {"forecast": forecast, "air_quality": air}
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@router.get("/marine")
async def marine_weather(lat: float, lon: float) -> dict:
    try:
        return await get_marine(lat, lon)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e

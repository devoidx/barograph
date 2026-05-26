from datetime import date
from typing import Any

from fastapi import APIRouter, HTTPException

from app.services.open_meteo import get_historical

router = APIRouter()

RECORD_YEARS = 5


@router.get("/alltime")
async def all_time_records(lat: float, lon: float) -> dict[str, Any]:
    try:
        end = date.today()
        start = date(end.year - RECORD_YEARS, 1, 1)
        data = await get_historical(lat, lon, str(start), str(end))
        return _extract_records(data)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


def _extract_records(data: dict[str, Any]) -> dict[str, Any]:
    daily = data.get("daily", {})
    times = daily.get("time", [])

    def best(values: list[Any], fn: Any) -> dict[str, Any]:
        pairs = [
            (v, t)
            for v, t in zip(values, times, strict=True)
            if v is not None
        ]
        if not pairs:
            return {"value": None, "date": None}
        val, dt = fn(pairs, key=lambda x: x[0])
        return {"value": round(val, 1), "date": dt}

    return {
        "highest_temp": best(daily.get("temperature_2m_max", []), max),
        "lowest_temp": best(daily.get("temperature_2m_min", []), min),
        "most_rain_day": best(daily.get("precipitation_sum", []), max),
        "max_wind_speed": best(daily.get("wind_speed_10m_max", []), max),
        "max_gust": best(daily.get("wind_gusts_10m_max", []), max),
        "max_uv": best(daily.get("uv_index_max", []), max),
        "most_sunshine": best(daily.get("sunshine_duration", []), max),
    }

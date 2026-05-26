from datetime import date, timedelta
from typing import Any

from fastapi import APIRouter, HTTPException

from app.services.open_meteo import get_historical

router = APIRouter()

def yesterday() -> date:
    return date.today() - timedelta(days=1)


@router.get("/monthly")
async def monthly_summary(
    lat: float,
    lon: float,
    year: int,
    month: int,
) -> dict[str, Any]:
    try:
        start = date(year, month, 1)
        if month == 12:
            end = date(year + 1, 1, 1) - timedelta(days=1)
        else:
            end = date(year, month + 1, 1) - timedelta(days=1)
        end = min(end, yesterday())
        if start > yesterday():
            return {"year": year, "month": month, "error": "no data yet"}
        data = await get_historical(lat, lon, str(start), str(end))
        return _summarise(data, year, month)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@router.get("/yearly")
async def yearly_summary(
    lat: float,
    lon: float,
    year: int,
) -> dict[str, Any]:
    try:
        start = date(year, 1, 1)
        end = min(date(year, 12, 31), yesterday())
        if start > yesterday():
            return {"year": year, "error": "no data yet"}
        data = await get_historical(lat, lon, str(start), str(end))
        return _summarise(data, year)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@router.get("/rainfall-years")
async def rainfall_by_year(
    lat: float,
    lon: float,
    years: int = 10,
) -> dict[str, Any]:
    try:
        end = yesterday()
        start = date(end.year - years, 1, 1)
        data = await get_historical(lat, lon, str(start), str(end))
        daily = data.get("daily", {})
        times = daily.get("time", [])
        rain = daily.get("precipitation_sum", [])
        by_year: dict[str, float] = {}
        for t, r in zip(times, rain, strict=True):
            y = t[:4]
            by_year[y] = round(by_year.get(y, 0.0) + (r or 0.0), 1)
        return {"rainfall_by_year": by_year}
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


def _summarise(
    data: dict[str, Any],
    year: int,
    month: int | None = None,
) -> dict[str, Any]:
    daily = data.get("daily", {})
    temps_max = [t for t in daily.get("temperature_2m_max", []) if t is not None]
    temps_min = [t for t in daily.get("temperature_2m_min", []) if t is not None]
    temps_mean = [t for t in daily.get("temperature_2m_mean", []) if t is not None]
    rain = [r for r in daily.get("precipitation_sum", []) if r is not None]
    sunshine = [s for s in daily.get("sunshine_duration", []) if s is not None]
    uv = [u for u in daily.get("uv_index_max", []) if u is not None]
    wind = [w for w in daily.get("wind_speed_10m_max", []) if w is not None]
    gusts = [g for g in daily.get("wind_gusts_10m_max", []) if g is not None]
    et = [e for e in daily.get("et0_fao_evapotranspiration", []) if e is not None]

    temp_mean = (
        round(sum(temps_mean) / len(temps_mean), 1) if temps_mean else None
    )

    return {
        "year": year,
        "month": month,
        "temp_max": round(max(temps_max), 1) if temps_max else None,
        "temp_min": round(min(temps_min), 1) if temps_min else None,
        "temp_mean": temp_mean,
        "rainfall_total_mm": round(sum(rain), 1) if rain else None,
        "sunshine_hours": round(sum(sunshine) / 3600, 1) if sunshine else None,
        "uv_max": round(max(uv), 1) if uv else None,
        "wind_max_kmh": round(max(wind), 1) if wind else None,
        "gust_max_kmh": round(max(gusts), 1) if gusts else None,
        "et_total_mm": round(sum(et), 1) if et else None,
        "daily": daily,
    }

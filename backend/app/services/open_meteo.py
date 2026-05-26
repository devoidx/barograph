from typing import Any

import httpx

BASE_FORECAST = "https://api.open-meteo.com/v1/forecast"
BASE_ARCHIVE = "https://archive-api.open-meteo.com/v1/archive"
BASE_AIR = "https://air-quality-api.open-meteo.com/v1/air-quality"
BASE_MARINE = "https://marine-api.open-meteo.com/v1/marine"


async def get_forecast(lat: float, lon: float) -> dict[str, Any]:
    params: dict[str, str] = {
        "latitude": str(lat),
        "longitude": str(lon),
        "timezone": "Europe/London",
        "forecast_days": "7",
        "current": ",".join([
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "is_day",
            "precipitation",
            "rain",
            "weather_code",
            "cloud_cover",
            "pressure_msl",
            "wind_speed_10m",
            "wind_direction_10m",
            "wind_gusts_10m",
            "uv_index",
            "sunshine_duration",
        ]),
        "hourly": ",".join([
            "temperature_2m",
            "precipitation_probability",
            "precipitation",
            "weather_code",
            "wind_speed_10m",
            "wind_direction_10m",
            "uv_index",
            "is_day",
        ]),
        "daily": ",".join([
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "apparent_temperature_max",
            "apparent_temperature_min",
            "sunrise",
            "sunset",
            "uv_index_max",
            "precipitation_sum",
            "precipitation_probability_max",
            "wind_speed_10m_max",
            "wind_gusts_10m_max",
            "sunshine_duration",
            "et0_fao_evapotranspiration",
        ]),
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(BASE_FORECAST, params=params)
        resp.raise_for_status()
        result: dict[str, Any] = resp.json()
        return result


async def get_air_quality(lat: float, lon: float) -> dict[str, Any]:
    params: dict[str, str] = {
        "latitude": str(lat),
        "longitude": str(lon),
        "timezone": "Europe/London",
        "current": ",".join([
            "european_aqi",
            "pm10",
            "pm2_5",
            "carbon_monoxide",
            "nitrogen_dioxide",
            "ozone",
        ]),
        "hourly": ",".join([
            "birch_pollen",
            "grass_pollen",
            "mugwort_pollen",
        ]),
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(BASE_AIR, params=params)
        resp.raise_for_status()
        result: dict[str, Any] = resp.json()
        return result


async def get_marine(lat: float, lon: float) -> dict[str, Any]:
    params: dict[str, str] = {
        "latitude": str(lat),
        "longitude": str(lon),
        "timezone": "Europe/London",
        "hourly": ",".join([
            "wave_height",
            "wave_direction",
            "wave_period",
            "swell_wave_height",
            "swell_wave_direction",
            "swell_wave_period",
            "sea_surface_temperature",
        ]),
        "daily": ",".join([
            "wave_height_max",
            "wave_period_max",
        ]),
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(BASE_MARINE, params=params)
        resp.raise_for_status()
        result: dict[str, Any] = resp.json()
        return result


async def get_historical(
    lat: float,
    lon: float,
    start_date: str,
    end_date: str,
) -> dict[str, Any]:
    params: dict[str, str] = {
        "latitude": str(lat),
        "longitude": str(lon),
        "timezone": "Europe/London",
        "start_date": start_date,
        "end_date": end_date,
        "daily": ",".join([
            "temperature_2m_max",
            "temperature_2m_min",
            "temperature_2m_mean",
            "precipitation_sum",
            "wind_speed_10m_max",
            "wind_gusts_10m_max",
            "sunshine_duration",
            "shortwave_radiation_sum",
            "et0_fao_evapotranspiration",
            "uv_index_max",
        ]),
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(BASE_ARCHIVE, params=params)
        resp.raise_for_status()
        result: dict[str, Any] = resp.json()
        return result

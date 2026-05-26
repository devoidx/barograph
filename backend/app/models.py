from sqlalchemy import Column, Date, Float, Integer, String

from app.database import Base


class DailySummary(Base):
    __tablename__ = "daily_summaries"

    id = Column(Integer, primary_key=True)
    date = Column(Date, unique=True, index=True, nullable=False)
    location_key = Column(String, nullable=False)
    temp_avg = Column(Float)
    temp_max = Column(Float)
    temp_min = Column(Float)
    humidity_avg = Column(Float)
    pressure_avg = Column(Float)
    wind_avg = Column(Float)
    wind_max_gust = Column(Float)
    wind_direction_avg = Column(Float)
    rainfall_mm = Column(Float)
    sunshine_hours = Column(Float)
    solar_max_wm2 = Column(Float)
    uv_max = Column(Float)
    et_mm = Column(Float)


class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(Integer, primary_key=True)
    location_key = Column(String, nullable=False)
    record_type = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    time = Column(String)

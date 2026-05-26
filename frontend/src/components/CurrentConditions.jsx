import { Droplets, Wind, Gauge, Eye, Thermometer, Sun } from 'lucide-react'

const WMO_ICONS = {
  0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',
  51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',
  71:'🌨️',73:'🌨️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',
  95:'⛈️',96:'⛈️',99:'⛈️',
}

const WMO_DESC = {
  0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
  45:'Fog',48:'Icy fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',
  61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',
  75:'Heavy snow',80:'Light showers',81:'Showers',82:'Heavy showers',
  95:'Thunderstorm',96:'Thunderstorm + hail',99:'Thunderstorm + hail',
}

function windDir(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function uviColour(uvi) {
  if (uvi <= 2) return '#16a34a'
  if (uvi <= 5) return '#d97706'
  if (uvi <= 7) return '#ea580c'
  if (uvi <= 10) return '#dc2626'
  return '#9333ea'
}

function uviLabel(uvi) {
  if (uvi <= 2) return 'Low'
  if (uvi <= 5) return 'Moderate'
  if (uvi <= 7) return 'High'
  if (uvi <= 10) return 'Very High'
  return 'Extreme'
}

function aqiLabel(aqi) {
  if (aqi <= 20) return { label: 'Good', color: '#16a34a' }
  if (aqi <= 40) return { label: 'Fair', color: '#65a30d' }
  if (aqi <= 60) return { label: 'Moderate', color: '#d97706' }
  if (aqi <= 80) return { label: 'Poor', color: '#ea580c' }
  return { label: 'Very Poor', color: '#dc2626' }
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      ...style,
    }}>
      {children}
    </div>
  )
}

function StatRow({ icon, label, value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '6px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ color: 'var(--text-hint)' }}>{icon}</span>
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', flex: 1 }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: '500' }}>{value}</span>
    </div>
  )
}

export default function CurrentConditions({ forecast, airQuality, locationName }) {
  const c = forecast.current
  const daily = forecast.daily
  const aqi = airQuality.current?.european_aqi
  const aqiInfo = aqi != null ? aqiLabel(aqi) : null

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}>
        {/* Main temp card */}
        <Card>
          <div style={{ fontSize: '12px', color: 'var(--text-hint)', marginBottom: '4px' }}>
            {locationName} · {new Date().toLocaleDateString('en-GB', {
              weekday: 'long', day: 'numeric', month: 'long'
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '56px', lineHeight: 1 }}>
              {WMO_ICONS[c.weather_code] || '🌡️'}
            </span>
            <div>
              <div style={{ fontSize: '52px', fontWeight: '300', lineHeight: 1, letterSpacing: '-2px' }}>
                {Math.round(c.temperature_2m)}°<span style={{ fontSize: '24px' }}>C</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {WMO_DESC[c.weather_code] || 'Unknown'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-hint)', marginTop: '2px' }}>
                Feels like {Math.round(c.apparent_temperature)}°C · {c.cloud_cover}% cloud
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', color: 'var(--text-hint)',
            paddingTop: '8px', borderTop: '1px solid var(--border)',
          }}>
            <span>🌅 {fmtTime(daily.sunrise[0])}</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            <span>🌇 {fmtTime(daily.sunset[0])}</span>
          </div>
        </Card>

        {/* Stats card */}
        <Card>
          <StatRow
            icon={<Droplets size={14} />}
            label="Humidity"
            value={`${c.relative_humidity_2m}%`}
          />
          <StatRow
            icon={<Gauge size={14} />}
            label="Pressure"
            value={`${Math.round(c.pressure_msl)} hPa`}
          />
          <StatRow
            icon={<Wind size={14} />}
            label="Wind"
            value={`${Math.round(c.wind_speed_10m)} km/h ${windDir(c.wind_direction_10m)}`}
          />
          <StatRow
            icon={<Wind size={14} />}
            label="Gusts"
            value={`${Math.round(c.wind_gusts_10m)} km/h`}
          />
          <StatRow
            icon={<Thermometer size={14} />}
            label="Dew point"
            value={`${Math.round(c.temperature_2m - ((100 - c.relative_humidity_2m) / 5))}°C`}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '6px' }}>
            <Sun size={14} color="var(--text-hint)" />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', flex: 1 }}>UV Index</span>
            <span style={{
              fontSize: '13px', fontWeight: '500',
              color: uviColour(c.uv_index),
            }}>
              {c.uv_index.toFixed(1)} — {uviLabel(c.uv_index)}
            </span>
          </div>
        </Card>
      </div>

      {/* AQI strip */}
      {aqiInfo && (
        <Card style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0.75rem 1.25rem' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-hint)' }}>Air Quality</span>
          <span style={{ fontSize: '20px', fontWeight: '500' }}>{aqi}</span>
          <span style={{
            fontSize: '12px', fontWeight: '500',
            color: aqiInfo.color,
          }}>
            {aqiInfo.label}
          </span>
          <div style={{ flex: 1 }} />
          {airQuality.current?.pm2_5 != null && (
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              PM2.5: {airQuality.current.pm2_5.toFixed(1)} µg/m³
            </span>
          )}
          {airQuality.current?.pm10 != null && (
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              PM10: {airQuality.current.pm10.toFixed(1)} µg/m³
            </span>
          )}
          {airQuality.current?.nitrogen_dioxide != null && (
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              NO₂: {airQuality.current.nitrogen_dioxide.toFixed(1)} µg/m³
            </span>
          )}
        </Card>
      )}
    </>
  )
}

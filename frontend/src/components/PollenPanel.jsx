function pollenLevel(value) {
  if (value == null) return { label: 'No data', color: 'var(--text-hint)', bg: 'var(--bg-secondary)' }
  if (value === 0) return { label: 'None', color: 'var(--success)', bg: 'var(--bg-secondary)' }
  if (value < 10) return { label: 'Low', color: 'var(--success)', bg: 'var(--bg-secondary)' }
  if (value < 30) return { label: 'Moderate', color: 'var(--warning)', bg: 'var(--bg-secondary)' }
  if (value < 80) return { label: 'High', color: '#ea580c', bg: 'var(--bg-secondary)' }
  return { label: 'Very High', color: 'var(--danger)', bg: 'var(--bg-secondary)' }
}

function PollenBar({ value, max = 100 }) {
  const pct = value != null ? Math.min((value / max) * 100, 100) : 0
  const { color } = pollenLevel(value)
  return (
    <div style={{
      width: '100%', height: '4px',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '2px',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`,
        height: '100%',
        backgroundColor: color,
        borderRadius: '2px',
        transition: 'width 0.3s ease',
      }} />
    </div>
  )
}

function PollenRow({ icon, label, value }) {
  const { label: levelLabel, color } = pollenLevel(value)
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>{icon}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: '500', color }}>
          {levelLabel}{value != null && value > 0 ? ` · ${Math.round(value)}` : ''}
        </span>
      </div>
      <PollenBar value={value} />
    </div>
  )
}

export default function PollenPanel({ airQuality }) {
  const now = new Date()
  const hourIdx = now.getHours()
  const hourly = airQuality.hourly

  const birch = hourly?.birch_pollen?.[hourIdx]
  const grass = hourly?.grass_pollen?.[hourIdx]
  const mugwort = hourly?.mugwort_pollen?.[hourIdx]

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
    }}>
      <div style={{
        fontSize: '11px',
        color: 'var(--text-hint)',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        marginBottom: '14px',
      }}>
        Pollen
      </div>
      <PollenRow icon="🌳" label="Birch" value={birch} />
      <PollenRow icon="🌾" label="Grass" value={grass} />
      <PollenRow icon="🌿" label="Mugwort" value={mugwort} />
      <div style={{ fontSize: '10px', color: 'var(--text-hint)', marginTop: '4px' }}>
        Grains/m³ · Updated hourly
      </div>
    </div>
  )
}

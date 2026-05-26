export default function SolarPanel({ daily }) {
  const today = {
    sunshine: daily.sunshine_duration?.[0],
    et: daily.et0_fao_evapotranspiration?.[0],
    uvMax: daily.uv_index_max?.[0],
  }

  const sunshineHours = today.sunshine != null
    ? (today.sunshine / 3600).toFixed(1)
    : null

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
        marginBottom: '12px',
      }}>
        Solar & Sunshine
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>☀️</div>
          <div style={{ fontSize: '18px', fontWeight: '500' }}>
            {sunshineHours ?? '—'}
            <span style={{ fontSize: '11px', color: 'var(--text-hint)', marginLeft: '2px' }}>hrs</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-hint)', marginTop: '2px' }}>
            Sunshine today
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🌱</div>
          <div style={{ fontSize: '18px', fontWeight: '500' }}>
            {today.et != null ? today.et.toFixed(1) : '—'}
            <span style={{ fontSize: '11px', color: 'var(--text-hint)', marginLeft: '2px' }}>mm</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-hint)', marginTop: '2px' }}>
            Evapotranspiration
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔆</div>
          <div style={{ fontSize: '18px', fontWeight: '500' }}>
            {today.uvMax != null ? today.uvMax.toFixed(1) : '—'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-hint)', marginTop: '2px' }}>
            Max UV today
          </div>
        </div>
      </div>
    </div>
  )
}

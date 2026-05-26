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

function uviAdvice(uvi) {
  if (uvi <= 2) return 'No protection needed'
  if (uvi <= 5) return 'Some protection recommended'
  if (uvi <= 7) return 'Protection essential — SPF 30+'
  if (uvi <= 10) return 'Extra protection — avoid midday sun'
  return 'Maximum protection — stay indoors'
}

export default function UVPanel({ current, dailyMaxUV }) {
  const uvi = current.uv_index
  const colour = uviColour(uvi)
  const pct = Math.min((uvi / 12) * 100, 100)

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
        UV Index
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '36px', fontWeight: '300', color: colour, lineHeight: 1 }}>
          {uvi.toFixed(1)}
        </span>
        <span style={{ fontSize: '14px', fontWeight: '500', color: colour }}>
          {uviLabel(uvi)}
        </span>
      </div>

      {/* Gradient bar */}
      <div style={{
        width: '100%', height: '8px',
        borderRadius: '4px',
        background: 'linear-gradient(to right, #16a34a, #d97706, #ea580c, #dc2626, #9333ea)',
        position: 'relative',
        marginBottom: '4px',
      }}>
        <div style={{
          position: 'absolute',
          top: '-3px',
          left: `${pct}%`,
          transform: 'translateX(-50%)',
          width: '14px', height: '14px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-card)',
          border: `2px solid ${colour}`,
        }} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '9px',
        color: 'var(--text-hint)',
        marginBottom: '10px',
      }}>
        <span>0</span><span>3</span><span>6</span><span>8</span><span>11+</span>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        {uviAdvice(uvi)}
      </div>
      {dailyMaxUV != null && (
        <div style={{ fontSize: '11px', color: 'var(--text-hint)', marginTop: '4px' }}>
          Max today: {dailyMaxUV.toFixed(1)}
        </div>
      )}
    </div>
  )
}

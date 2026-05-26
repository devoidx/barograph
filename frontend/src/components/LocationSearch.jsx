import { useState } from 'react'
import { Search } from 'lucide-react'
import { geocode } from '../api/weather'

export default function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)

  async function handleSearch(e) {
    const val = e.target.value
    setQuery(val)
    if (val.length < 2) { setResults([]); return }
    try {
      const data = await geocode(val)
      setResults(data.results || [])
      setOpen(true)
    } catch {
      setResults([])
    }
  }

  function handleSelect(r) {
    onSelect({
      name: r.name + (r.admin1 ? `, ${r.admin1}` : ''),
      lat: r.latitude,
      lon: r.longitude,
    })
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative', width: '260px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '6px 10px',
      }}>
        <Search size={13} color="var(--text-hint)" />
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search location..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            color: 'var(--text-primary)',
            width: '100%',
          }}
        />
      </div>
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          boxShadow: 'var(--shadow)',
          zIndex: 200,
          overflow: 'hidden',
        }}>
          {results.slice(0, 5).map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(r)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: 'var(--text-primary)',
                borderBottom: i < results.length - 1
                  ? '1px solid var(--border)' : 'none',
              }}
              onMouseEnter={e => e.target.style.backgroundColor = 'var(--bg-secondary)'}
              onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
            >
              {r.name}{r.admin1 ? `, ${r.admin1}` : ''}, {r.country}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

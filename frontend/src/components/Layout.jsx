import { useState } from 'react'
import { Moon, Sun, MapPin, Wind } from 'lucide-react'
import LocationSearch from './LocationSearch'
import Dashboard from './Dashboard'

const DEFAULT_LOCATION = {
  name: 'London',
  lat: 51.5085,
  lon: -0.1257,
}

export default function Layout({ theme, onThemeToggle }) {
  const [location, setLocation] = useState(DEFAULT_LOCATION)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <header style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '0.875rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wind size={20} color="var(--accent)" />
          <span style={{
            fontSize: '17px',
            fontWeight: '600',
            letterSpacing: '-0.3px',
            color: 'var(--text-primary)',
          }}>
            Barograph
          </span>
        </div>

        <LocationSearch onSelect={setLocation} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--text-hint)',
          }}>
            <MapPin size={12} />
            <span>{location.name}</span>
          </div>
          <button
            onClick={onThemeToggle}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
        <Dashboard location={location} />
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        fontSize: '11px',
        color: 'var(--text-hint)',
        borderTop: '1px solid var(--border)',
        marginTop: '2rem',
      }}>
        Barograph · Data: Open-Meteo (open-meteo.com) · Free &amp; open-source APIs
      </footer>
    </div>
  )
}

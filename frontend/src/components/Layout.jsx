import { useState, useEffect } from 'react'
import { Moon, Sun, MapPin, Wind } from 'lucide-react'
import LocationSearch from './LocationSearch'
import Dashboard from './Dashboard'

const DEFAULT_LOCATION = {
  name: 'St. Ives, Cambridgeshire',
  lat: 52.3298,
  lon: -0.0739,
}

export default function Layout({ theme, onThemeToggle }) {
  const [location, setLocation] = useState(null)
  const [detecting, setDetecting] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION)
      setDetecting(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en`
          )
          const geo = await res.json()
          setLocation({
            name: geo.name || 'My Location',
            lat,
            lon,
          })
        } catch {
          setLocation({ ...DEFAULT_LOCATION, lat: pos.coords.latitude, lon: pos.coords.longitude })
        } finally {
          setDetecting(false)
        }
      },
      () => {
        setLocation(DEFAULT_LOCATION)
        setDetecting(false)
      },
      { timeout: 5000 }
    )
  }, [])

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
            <span>{detecting ? 'Detecting...' : location?.name}</span>
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
        {!detecting && location && <Dashboard location={location} />}
        {detecting && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
            color: 'var(--text-hint)',
            fontSize: '14px',
            gap: '10px',
          }}>
            <div style={{
              width: '18px', height: '18px',
              border: '2px solid var(--border)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            Detecting your location...
          </div>
        )}
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

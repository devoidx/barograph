import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function fmtRadarTime(ts) {
  return new Date(ts * 1000).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function RadarMap({ location }) {
  const mapRef = useRef(null)
  const instanceRef = useRef(null)
  const layersRef = useRef([])
  const framesRef = useRef([])
  const animRef = useRef(null)
  const [playing, setPlaying] = useState(true)
  const [frameIdx, setFrameIdx] = useState(0)
  const [frameCount, setFrameCount] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (instanceRef.current) return
    if (!mapRef.current) return

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
      minZoom: 4,
      maxZoom: 7,
    })
    instanceRef.current = map
    map.setView([location.lat, location.lon], 6)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 7,
    }).addTo(map)

    L.circleMarker([location.lat, location.lon], {
      radius: 7,
      fillColor: '#4d9ef6',
      color: '#ffffff',
      weight: 2,
      fillOpacity: 1,
    }).addTo(map)

    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then(data => {
        const past = data.radar.past.slice(-6)
        const nowcast = (data.radar.nowcast || []).slice(0, 2)
        const frames = [...past, ...nowcast]
        framesRef.current = frames
        const layers = frames.map(f => {
          const layer = L.tileLayer(
            `https://tilecache.rainviewer.com${f.path}/256/{z}/{x}/{y}/2/1_1.png`,
            { opacity: 0.65, zIndex: 5, maxZoom: 7, attribution: 'RainViewer' }
          )
          layer.on('tileerror', () => {})
          return layer
        })
        layersRef.current = layers
        if (layers.length > 0) layers[0].addTo(map)
        setFrameCount(layers.length)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))

    return () => {
      if (animRef.current) clearInterval(animRef.current)
      map.remove()
      instanceRef.current = null
      layersRef.current = []
      framesRef.current = []
    }
  }, [location.lat, location.lon])

  useEffect(() => {
    if (!loaded || layersRef.current.length === 0) return
    if (animRef.current) clearInterval(animRef.current)
    if (!playing) return

    animRef.current = setInterval(() => {
      setFrameIdx(prev => {
        const next = (prev + 1) % layersRef.current.length
        const map = instanceRef.current
        if (map) {
          map.removeLayer(layersRef.current[prev])
          layersRef.current[next].addTo(map)
        }
        return next
      })
    }, 600)

    return () => clearInterval(animRef.current)
  }, [playing, loaded])

  function togglePlay() {
    setPlaying(p => {
      if (p && animRef.current) clearInterval(animRef.current)
      return !p
    })
  }

  const pastCount = Math.min(6, frameCount)
  const currentFrame = framesRef.current[frameIdx]
  const isNowcast = frameIdx >= pastCount
  const timeLabel = currentFrame
    ? `${fmtRadarTime(currentFrame.time)}${isNowcast ? ' (forecast)' : ''}`
    : ''

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-hint)',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
        }}>
          Rain Radar · last 60 mins + nowcast
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {timeLabel && (
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: isNowcast ? 'var(--warning)' : 'var(--text-primary)',
              minWidth: '110px',
              textAlign: 'center',
            }}>
              {timeLabel}
            </span>
          )}
          {frameCount > 0 && (
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              {Array.from({ length: frameCount }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (!instanceRef.current) return
                    instanceRef.current.removeLayer(layersRef.current[frameIdx])
                    layersRef.current[i].addTo(instanceRef.current)
                    setFrameIdx(i)
                    setPlaying(false)
                    if (animRef.current) clearInterval(animRef.current)
                  }}
                  style={{
                    width: i === frameIdx ? '16px' : '8px',
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: i === frameIdx
                      ? (i >= pastCount ? 'var(--warning)' : 'var(--accent)')
                      : 'var(--border-strong)',
                    cursor: 'pointer',
                    transition: 'width 0.15s ease',
                  }}
                />
              ))}
            </div>
          )}
          <button
            onClick={togglePlay}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '4px 10px',
              cursor: 'pointer',
              fontSize: '12px',
              color: 'var(--text-primary)',
            }}
          >
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <span style={{ fontSize: '10px', color: 'var(--text-hint)' }}>
            RainViewer
          </span>
        </div>
      </div>
      <div ref={mapRef} style={{ height: '380px', width: '100%' }} />
    </div>
  )
}

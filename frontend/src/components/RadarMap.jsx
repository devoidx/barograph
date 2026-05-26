import { useEffect, useRef, useState } from 'react'

export default function RadarMap({ location }) {
  const mapRef = useRef(null)
  const instanceRef = useRef(null)
  const layersRef = useRef([])
  const animRef = useRef(null)
  const [playing, setPlaying] = useState(true)
  const [frameIdx, setFrameIdx] = useState(0)
  const [frameCount, setFrameCount] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (instanceRef.current) return
    if (!mapRef.current) return

    const L = window.L
    if (!L) return

    const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false })
    instanceRef.current = map

    map.setView([location.lat, location.lon], 7)

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_matter_nolabels/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', maxZoom: 19 }
    ).addTo(map)

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_matter_only_labels/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', maxZoom: 19, zIndex: 10 }
    ).addTo(map)

    L.circleMarker([location.lat, location.lon], {
      radius: 6,
      fillColor: '#4d9ef6',
      color: '#fff',
      weight: 2,
      fillOpacity: 1,
    }).addTo(map)

    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then(data => {
        const frames = [
          ...data.radar.past.slice(-6),
          ...data.radar.nowcast.slice(0, 2),
        ]
        const layers = frames.map(f =>
          L.tileLayer(
            `https://tilecache.rainviewer.com${f.path}/256/{z}/{x}/{y}/2/1_1.png`,
            { opacity: 0.6, zIndex: 5 }
          )
        )
        layersRef.current = layers
        layers[0].addTo(map)
        setFrameCount(layers.length)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))

    return () => {
      if (animRef.current) clearInterval(animRef.current)
      map.remove()
      instanceRef.current = null
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
    if (!playing) {
      setPlaying(true)
    } else {
      setPlaying(false)
      if (animRef.current) clearInterval(animRef.current)
    }
  }

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
          Rain Radar
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {frameCount > 0 && (
            <span style={{ fontSize: '11px', color: 'var(--text-hint)' }}>
              Frame {frameIdx + 1}/{frameCount}
            </span>
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
      <div ref={mapRef} style={{ height: '360px', width: '100%' }} />
    </div>
  )
}

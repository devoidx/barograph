import { useQuery } from '@tanstack/react-query'
import { fetchRainfallYears } from '../api/weather'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function RainfallChart({ location }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rainfall-years', location.lat, location.lon],
    queryFn: () => fetchRainfallYears(location.lat, location.lon, 10),
    staleTime: 24 * 60 * 60 * 1000,
  })

  if (isLoading) return <PanelSkeleton title="Annual Rainfall" />
  if (error) return <PanelError title="Annual Rainfall" />

  const currentYear = new Date().getFullYear().toString()
  const chartData = Object.entries(data.rainfall_by_year)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, mm]) => ({ year, mm }))

  const avg = Math.round(
    chartData.slice(0, -1).reduce((s, d) => s + d.mm, 0) /
    Math.max(chartData.slice(0, -1).length, 1)
  )

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '4px',
      }}>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-hint)',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
        }}>
          Annual Rainfall
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-hint)' }}>
          10-yr avg: {avg} mm
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="year"
            tick={{ fontSize: 10, fill: 'var(--text-hint)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--text-hint)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--text-primary)',
            }}
            formatter={(v) => [`${v} mm`, 'Rainfall']}
            cursor={{ fill: 'var(--bg-secondary)' }}
          />
          <Bar dataKey="mm" radius={[3, 3, 0, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.year}
                fill={entry.year === currentYear ? 'var(--accent)' : '#4d9ef660'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-hint)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--accent)' }} />
          Current year
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-hint)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#4d9ef660' }} />
          Previous years
        </div>
      </div>
    </div>
  )
}

function PanelSkeleton({ title }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      height: '240px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
        {title}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-hint)', fontSize: '13px' }}>
        Loading...
      </div>
    </div>
  )
}

function PanelError({ title }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      height: '240px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
        {title}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', fontSize: '13px' }}>
        Failed to load
      </div>
    </div>
  )
}

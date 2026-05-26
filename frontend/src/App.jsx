import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTheme } from './hooks/useTheme'
import Layout from './components/Layout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
})

export default function App() {
  const { theme, toggle } = useTheme()
  return (
    <QueryClientProvider client={queryClient}>
      <Layout theme={theme} onThemeToggle={toggle} />
    </QueryClientProvider>
  )
}

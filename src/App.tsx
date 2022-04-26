import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthStateProvider } from './providers'
import { routes } from './configs'
import { AuthChecker } from './components'
import { DataSyncProvider } from './providers/DataSyncProvider'

declare module 'react-query/types/react/QueryClientProvider' {
  interface QueryClientProviderProps {
    children?: ReactNode
  }
}

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/gitnotes/">
        <AuthStateProvider>
          <DataSyncProvider>
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    route.protected ? (
                      <AuthChecker>{route.component}</AuthChecker>
                    ) : (
                      route.component
                    )
                  }
                />
              ))}
            </Routes>
          </DataSyncProvider>
        </AuthStateProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthStateProvider } from './providers'
import { routes } from './configs'
import { AuthChecker } from './components'
import { ApolloClientProvider } from './providers/ApolloClientProvider'

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloClientProvider>
        <BrowserRouter basename="/gitnotes/">
          <AuthStateProvider>
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
          </AuthStateProvider>
        </BrowserRouter>
      </ApolloClientProvider>
    </QueryClientProvider>
  )
}

export default App

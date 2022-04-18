import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { HomePage, LoginPage } from '../pages'
interface RouteType {
  path: string
  component: ReactNode
  name?: string
  protected: boolean
  exact?: boolean
}

export const routes: RouteType[] = [
  {
    path: '/',
    component: <HomePage />,
    name: 'Home Screen',
    protected: true
  },
  {
    path: 'login',
    component: <LoginPage />,
    name: 'Login Screen',
    protected: false
  },
  {
    path: '*',
    component: <Navigate to="/" />,
    protected: true
  }
]

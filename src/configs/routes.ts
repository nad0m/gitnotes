import { HomePage, LoginPage } from '../pages'
interface RouteType {
  path: string
  component: any
  name: string
  protected: boolean
}

export const routes: RouteType[] = [
  {
    path: '/',
    component: HomePage,
    name: 'Home Screen',
    protected: true,
  },
  {
    path: '/login',
    component: LoginPage,
    name: 'Login Screen',
    protected: false,
  },
]
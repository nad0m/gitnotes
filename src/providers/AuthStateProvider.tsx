import {
  FC,
  createContext,
  useState,
  useContext,
  Dispatch,
  ReactNode,
  useEffect
} from 'react'
import { getAuth } from '@firebase/auth'
import { useLocalStorage } from 'react-use'
import { LOCAL_STORAGE_KEY_GITHUB_TOKEN } from '../configs'
import { IAuthState } from '../types'
import { useAuthState } from 'react-firebase-hooks/auth'

type AuthStateContextT = {
  authState: IAuthState
  setToken: Dispatch<string>
}

const initialContext: AuthStateContextT = {
  authState: {
    token: ''
  },
  setToken: () => {}
}

const AuthStateContext = createContext<AuthStateContextT>(initialContext)

export const AuthStateProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [authState, setAuthState] = useState<IAuthState>({ token: '' })
  const [user] = useAuthState(getAuth())
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_KEY_GITHUB_TOKEN)

  useEffect(() => {
    const value: IAuthState = {
      ...user,
      token: token as string
    }
    setAuthState(value)
  }, [user, token, setAuthState])

  return (
    <AuthStateContext.Provider value={{ authState, setToken }}>
      {children}
    </AuthStateContext.Provider>
  )
}

export const useAuthStateContext = () => useContext(AuthStateContext)

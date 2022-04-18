import { FC, createContext, useState, useContext, Dispatch, SetStateAction, ReactNode } from 'react'
import { OAuthCredential, User } from '@firebase/auth'

type AuthT = {
  credential?: OAuthCredential | null
  token: string
  user?: User | null
  username: string | null
}

export type AuthContextT = {
  auth: AuthT
  setAuth: Dispatch<SetStateAction<AuthT>>
}

const initialContext: AuthContextT = {
  auth: {
    credential: null,
    token: '',
    user: null,
    username: null,
  },
  setAuth: () => { },
}

const AuthContext = createContext<AuthContextT>(initialContext)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthT>(initialContext.auth)

  const value = {
    auth,
    setAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)

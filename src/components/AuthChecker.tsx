import React from 'react'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate } from 'react-router-dom'
import { useLocalStorage } from 'react-use'
import { LOCAL_STORAGE_KEY_GITHUB_TOKEN } from '../configs'

interface Props {
  children: React.ReactNode
}

export const AuthChecker = ({ children }: Props) => {
  const [user, loading, error] = useAuthState(getAuth())
  const [token] = useLocalStorage(LOCAL_STORAGE_KEY_GITHUB_TOKEN)
  //const { isLoading, isError, mutate } = useFirstTimeLoginCheck()

  if (loading || error) {
    return null
  }

  if (!user || !token) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate } from 'react-router-dom'
import { useLocalStorage } from 'react-use'
import { LOCAL_STORAGE_KEY_GITHUB_TOKEN } from '../configs'
import { useSignInWithGithub } from '../hooks'

export const LoginPage = () => {
  const { isLoading, isError, mutate } = useSignInWithGithub()
  const [user, loading] = useAuthState(getAuth())
  const [token] = useLocalStorage(LOCAL_STORAGE_KEY_GITHUB_TOKEN)

  if (loading) {
    return <>Loading...</>
  }

  if (user && token) {
    return <Navigate to="/" />
  }

  return <button onClick={() => mutate()}>Sign in</button>
}

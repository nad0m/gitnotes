import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from 'react-use'
import { useMutation } from 'react-query'
import { signInWithGithub } from '../firebase'
import { LOCAL_STORAGE_KEY_GITHUB_TOKEN } from '../configs'

export const useSignInWithGithub = () => {
  const navigate = useNavigate()
  const [, setLocalStorageToken] = useLocalStorage<string>(
    LOCAL_STORAGE_KEY_GITHUB_TOKEN
  )
  const onSuccess = (token: string) => {
    setLocalStorageToken(token)
    navigate('/')
  }
  const { isLoading, isError, mutate } = useMutation('sign-in-github', () =>
    signInWithGithub(onSuccess)
  )

  return {
    isLoading,
    isError,
    mutate
  }
}

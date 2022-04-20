import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { signInWithGithub } from '../firebase'
import { useAuthStateContext } from '../providers'

export const useSignInWithGithub = () => {
  const navigate = useNavigate()
  const setToken = useAuthStateContext()?.setToken

  const onSuccess = (token: string) => {
    setToken?.(token)
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

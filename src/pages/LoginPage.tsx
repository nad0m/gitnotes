import { useSignInWithGithub } from "../hooks"

export const LoginPage = () => {
  const { isLoading, isError, mutate } = useSignInWithGithub()

  return (
    <button onClick={() => mutate()}>Sign in</button>

  )
}
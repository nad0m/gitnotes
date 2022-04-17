import { GithubAuthProvider, signInWithPopup, getAuth } from "firebase/auth"

export const signInWithGithub = async (onSuccess: (token: string) => void): Promise<void> => {
  const provider = new GithubAuthProvider()
  provider.addScope('repo')
  const result = await signInWithPopup(getAuth(), provider)
  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
  const credential = GithubAuthProvider.credentialFromResult(result)
  const token = credential?.accessToken ?? ''
  if (token) {
    onSuccess(token)
  }
}
import { FC } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth, signOut } from 'firebase/auth'
import { Playground } from 'lib'

export const HomePage: FC = () => {
  const auth = getAuth()
  const [user, loading, error] = useAuthState(auth)

  console.log({ user, loading, error })

  return (
    <>
      <button onClick={() => signOut(auth)}>Sign out</button>
      <Playground />
    </>
  )
}

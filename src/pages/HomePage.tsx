import { FC } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth, signOut } from 'firebase/auth'
import { Playground } from '../lib'
import { useGetRepositoryQuery } from '../generated/graphql'

export const HomePage: FC = () => {
  const auth = getAuth()

  const { data, loading, error } = useGetRepositoryQuery({
    variables: {
      owner: 'nad0m',
      name: 'gitnotes-database'
    }
  })

  console.log({ data, loading, error })

  return (
    <>
      <button onClick={() => signOut(auth)}>Sign out</button>
      <Playground />
    </>
  )
}

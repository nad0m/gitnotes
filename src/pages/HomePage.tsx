import { FC } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { Playground } from '../lib'
import { useLocalStorage } from 'react-use'
import { LOCAL_STORAGE_KEY_GITHUB_TOKEN } from '../configs'
import { initialNotes } from '../utils/data/initialNotes'
import { initialCategories } from '../utils/data/initialCategories'
import { useSyncData } from '../hooks'

export const HomePage: FC = () => {
  const auth = getAuth()
  const [, , remove] = useLocalStorage(LOCAL_STORAGE_KEY_GITHUB_TOKEN)
  const { syncData, isLoading, isError, isSuccess } = useSyncData()

  console.log({ isLoading, isError, isSuccess })

  const onClick = () => {
    syncData({
      noteItems: initialNotes,
      categoryItems: initialCategories
    })
  }

  return (
    <>
      <button onClick={onClick}>add commit</button>
      <button onClick={() => signOut(auth).then(remove)}>Sign out</button>
      <Playground />
    </>
  )
}

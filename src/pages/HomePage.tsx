import { FC } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { Playground } from '../lib'
import { useLocalStorage } from 'react-use'
import { LOCAL_STORAGE_KEY_GITHUB_TOKEN } from '../configs'
import { initialNotes } from '../utils/data/initialNotes'
import { initialCategories } from '../utils/data/initialCategories'
import { useSyncData } from '../hooks'
import {
  CurrentEditorProvider,
  useCurrentEditorContext
} from '../providers/CurrentEditorProvider'
import { editorState } from '../mock/editorState'
import { useDataSyncContext } from '../providers/DataSyncProvider'
import { Types } from '../utils/reducers'

export const HomePage: FC = () => {
  const auth = getAuth()
  const [, , remove] = useLocalStorage(LOCAL_STORAGE_KEY_GITHUB_TOKEN)
  const { dispatch } = useDataSyncContext()

  const onClick = () => {
    dispatch({
      type: Types.AddNote,
      payload: { ...initialNotes[0], title: 'New Note' }
    })
  }

  return (
    <CurrentEditorProvider>
      <button onClick={onClick}>add commit</button>
      <button onClick={() => signOut(auth).then(remove)}>Sign out</button>
      <Playground />
    </CurrentEditorProvider>
  )
}

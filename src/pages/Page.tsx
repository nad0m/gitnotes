import { FC, useTransition } from 'react'
import { useParams } from 'react-router-dom'
import { Playground } from '../lib'
import {
  CurrentEditorProvider,
  useCurrentEditorContext
} from '../providers/CurrentEditorProvider'
import { useDataSyncContext } from '../providers/DataSyncProvider'
import { Types } from '../utils/reducers'

const Toolbar: FC = () => {
  const { noteId } = useParams()
  const { handleSyncData, dispatch } = useDataSyncContext()
  const { editor } = useCurrentEditorContext()
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(() =>
      dispatch({
        type: Types.UpdateNote,
        payload: {
          id: noteId ?? '',
          fields: {
            editorState: JSON.stringify(editor?.getEditorState())
          }
        }
      })
    )

    if (!isPending) {
      handleSyncData()
    }
  }

  return <button onClick={handleSave}>add commit</button>
}

export const Page = () => {
  return (
    <CurrentEditorProvider>
      <Toolbar />
      <Playground />
    </CurrentEditorProvider>
  )
}

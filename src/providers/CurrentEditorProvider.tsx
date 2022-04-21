import {
  FC,
  createContext,
  useState,
  useContext,
  Dispatch,
  ReactNode
} from 'react'
import { LexicalEditor } from 'lexical'
import { RouterBreadcrumbs } from '../components/RouterBreadcrumbs'
import { initialCategories } from '../utils/data/initialCategories'
import { initialNotes } from '../utils/data/initialNotes'
import { useGetCategories, useGetNotes } from '../hooks'
import { useDataSyncContext } from './DataSyncProvider'

type CurrentEditorContextT = {
  editor: LexicalEditor | null
  setEditor: Dispatch<React.SetStateAction<LexicalEditor | null>>
}

const initialContext: CurrentEditorContextT = {
  editor: null,
  setEditor: () => {}
}

const CurrentEditorContext =
  createContext<CurrentEditorContextT>(initialContext)

export const CurrentEditorProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [editor, setEditor] = useState<LexicalEditor | null>(null)
  const { state, dispatch } = useDataSyncContext()

  console.log({ state })

  return (
    <CurrentEditorContext.Provider value={{ editor, setEditor }}>
      <RouterBreadcrumbs
        categoryItems={state.categoryItems ?? []}
        noteItems={state.noteItems ?? []}
      />
      {children}
    </CurrentEditorContext.Provider>
  )
}

export const useCurrentEditorContext = () => useContext(CurrentEditorContext)

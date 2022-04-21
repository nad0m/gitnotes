import {
  FC,
  createContext,
  useState,
  useContext,
  Dispatch,
  ReactNode
} from 'react'
import { LexicalEditor } from 'lexical'

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

  return (
    <CurrentEditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </CurrentEditorContext.Provider>
  )
}

export const useCurrentEditorContext = () => useContext(CurrentEditorContext)

import {
  FC,
  createContext,
  useState,
  useContext,
  Dispatch,
  ReactNode
} from 'react'
import { LexicalEditor } from 'lexical'
import { useGetCategories, useGetNotes } from '../hooks'
import { useDataSyncContext } from './DataSyncProvider'
import { Category } from '../components/Category'
import { Types } from '../utils/reducers'
import { NoteList } from '../components/NoteList'
import { useParams } from 'react-router-dom'

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
  const { noteId: currentNoteId } = useParams()

  const onEditCategoryName = (categoryId: string, name: string) => {
    dispatch({
      type: Types.UpdateCategory,
      payload: {
        id: categoryId,
        fields: {
          name
        }
      }
    })
  }

  const onEditNoteName = (noteId: string, title: string) => {
    dispatch({
      type: Types.UpdateNote,
      payload: {
        id: noteId,
        fields: {
          title
        }
      }
    })
  }

  return (
    <CurrentEditorContext.Provider value={{ editor, setEditor }}>
      <div
        style={{
          width: '300px',
          padding: '24px',
          backgroundColor: '#25283d',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
        {state.categoryItems.map((categoryItem) => {
          return (
            <Category
              key={categoryItem.id}
              categoryItem={categoryItem}
              onEditCategoryName={onEditCategoryName}>
              <NoteList
                categoryId={categoryItem.id}
                noteItems={state.noteItems}
                onEditNoteName={onEditNoteName}
                currentNoteId={currentNoteId ?? ''}
              />
            </Category>
          )
        })}
      </div>
      {children}
    </CurrentEditorContext.Provider>
  )
}

export const useCurrentEditorContext = () => useContext(CurrentEditorContext)

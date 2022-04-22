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
import { Category } from '../components/Category'
import { Types } from '../utils/reducers'

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

  return (
    <CurrentEditorContext.Provider value={{ editor, setEditor }}>
      <div
        style={{
          width: '300px',
          padding: '24px',
          backgroundColor: '#25283d',
          color: '#fff'
        }}>
        {state.categoryItems.map((categoryItem) => {
          return (
            <Category
              key={categoryItem.id}
              categoryItem={categoryItem}
              onEditCategoryName={onEditCategoryName}
            />
          )
        })}
      </div>
      {children}
    </CurrentEditorContext.Provider>
  )
}

export const useCurrentEditorContext = () => useContext(CurrentEditorContext)

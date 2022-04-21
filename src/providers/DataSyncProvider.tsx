import React, {
  createContext,
  useReducer,
  Dispatch,
  useContext,
  useEffect
} from 'react'
import { useGetCategories, useGetNotes } from '../hooks'
import { CategoryItem, NoteItem } from '../types'
import { NoteAction } from '../types/enums'
import {
  CategoryActions,
  categoryItemsReducer,
  NoteActions,
  noteItemsReducer,
  Types
} from '../utils/reducers'

type InitialStateType = {
  categoryItems: CategoryItem[]
  noteItems: NoteItem[]
}

const initialState = {
  categoryItems: [],
  noteItems: []
}

const DataSyncContext = createContext<{
  state: InitialStateType
  dispatch: Dispatch<CategoryActions | NoteActions>
}>({
  state: initialState,
  dispatch: () => null
})

const mainReducer = (
  { categoryItems, noteItems }: InitialStateType,
  action: CategoryActions | NoteActions
) => ({
  categoryItems: categoryItemsReducer(categoryItems, action),
  noteItems: noteItemsReducer(noteItems, action)
})

export const DataSyncProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState)
  const { categoryItems } = useGetCategories()
  const { noteItems } = useGetNotes()

  useEffect(() => {
    if (categoryItems && noteItems) {
      dispatch({
        type: Types.InitializeData,
        payload: {
          categoryItems,
          noteItems
        }
      })
    }
  }, [categoryItems, noteItems])

  return (
    <DataSyncContext.Provider value={{ state, dispatch }}>
      {children}
    </DataSyncContext.Provider>
  )
}

export const useDataSyncContext = () => useContext(DataSyncContext)

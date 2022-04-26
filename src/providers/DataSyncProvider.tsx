import React, {
  createContext,
  useReducer,
  Dispatch,
  useContext,
  useEffect,
  useCallback
} from 'react'
import { useParams } from 'react-router-dom'
import {
  useGetCategories,
  useGetCategoriesAndNotes,
  useGetNotes,
  useSyncData
} from '../hooks'
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
  handleSyncData: () => void
}>({
  state: initialState,
  dispatch: () => null,
  handleSyncData: () => null
})

const mainReducer = (
  { categoryItems, noteItems }: InitialStateType,
  action: CategoryActions | NoteActions
) => ({
  categoryItems: categoryItemsReducer(categoryItems, action),
  noteItems: noteItemsReducer(noteItems, action)
})

export const DataSyncProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [state, dispatch] = useReducer(mainReducer, initialState)
  const { syncData } = useSyncData()
  const { categoriesAndNotes } = useGetCategoriesAndNotes()
  const { categoryItems = [], noteItems = [] } = categoriesAndNotes ?? {}

  const handleSyncData = useCallback(() => {
    syncData({
      categoryItems: state.categoryItems,
      noteItems: state.noteItems
    })
  }, [state.categoryItems, state.noteItems, syncData])

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
  }, [categoryItems, noteItems, dispatch])

  return (
    <DataSyncContext.Provider value={{ state, dispatch, handleSyncData }}>
      {children}
    </DataSyncContext.Provider>
  )
}

export const useDataSyncContext = () => useContext(DataSyncContext)

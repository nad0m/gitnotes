import { CategoryItem, NoteItem } from '../types'

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export enum Types {
  InitializeData = 'INITIALIZE_DATA',
  AddCategory = 'ADD_CATEGORY',
  UpdateCategory = 'UPDATE_CATEGORY',
  DeleteCategory = 'DELETE_CATEGORY',
  AddNote = 'ADD_NOTE',
  UpdateNote = 'UPDATE_NOTE',
  DeleteNote = 'DELETE_NOTE'
}

type CategoryPayload = {
  [Types.AddCategory]: CategoryItem
  [Types.UpdateCategory]: {
    id: string
    fields: Partial<CategoryItem>
  }
  [Types.DeleteCategory]: {
    id: string
  }
  [Types.InitializeData]: {
    categoryItems: CategoryItem[]
    noteItems: NoteItem[]
  }
}

export type CategoryActions =
  ActionMap<CategoryPayload>[keyof ActionMap<CategoryPayload>]

type NotePayload = {
  [Types.AddNote]: NoteItem
  [Types.UpdateNote]: {
    id: string
    fields: Partial<NoteItem>
  }
  [Types.DeleteNote]: {
    id: string
  }
  [Types.InitializeData]: {
    categoryItems: CategoryItem[]
    noteItems: NoteItem[]
  }
}

export type NoteActions = ActionMap<NotePayload>[keyof ActionMap<NotePayload>]

export const categoryItemsReducer = (
  state: CategoryItem[],
  action: CategoryActions | NoteActions
) => {
  switch (action.type) {
    case Types.AddCategory:
      return [...state, action.payload]
    case Types.UpdateCategory:
      const foundIndex = state.findIndex(({ id }) => id === action.payload.id)
      if (foundIndex > -1) {
        const updatedCategory = {
          ...state[foundIndex],
          ...action.payload.fields
        }
        state[foundIndex] = updatedCategory
      }
      return [...state]
    case Types.DeleteCategory:
      return [...state.filter((product) => product.id !== action.payload.id)]
    case Types.InitializeData:
      return action.payload.categoryItems
    default:
      return state
  }
}

export const noteItemsReducer = (
  state: NoteItem[],
  action: CategoryActions | NoteActions
) => {
  switch (action.type) {
    case Types.AddNote:
      return [...state, action.payload]
    case Types.UpdateNote:
      const foundIndex = state.findIndex(({ id }) => id === action.payload.id)
      if (foundIndex > -1) {
        const updatedNote = {
          ...state[foundIndex],
          ...action.payload.fields
        }
        state[foundIndex] = updatedNote
      }
      return [...state]
    case Types.DeleteNote:
      return [...state.filter((product) => product.id !== action.payload.id)]
    case Types.InitializeData:
      return action.payload.noteItems
    default:
      return state
  }
}

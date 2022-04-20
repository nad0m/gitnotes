import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'
import { NoteItem } from '../../types'
import { emptyEditorState } from './emptyEditorState'

export const initialNotes: NoteItem[] = [
  {
    id: uuid(),
    title: 'Welcome note',
    editorState: JSON.stringify(emptyEditorState),
    categoryId: '1234',
    favorite: false,
    created: dayjs().format(),
    lastUpdated: dayjs().format()
  }
]

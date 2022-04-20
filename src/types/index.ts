import { OAuthCredential, User } from 'firebase/auth'
import { EditorState } from 'lexical'
import React from 'react'

import { Folder, NotesSortKey } from './enums'

//==============================================================================
// Items
//==============================================================================

export interface NoteItem {
  id: string
  title: string
  editorState: string
  created: string
  lastUpdated: string
  /**
   * Refers to the category UUID and not the actual name.
   */
  categoryId?: string
  favorite?: boolean
}

export interface CategoryItem {
  id: string
  name: string
  favorite?: boolean
}

//==============================================================================
// State
//==============================================================================

export interface CategoryState {
  categories: CategoryItem[]
  error: string
  loading: boolean
  editingCategory: {
    id: string
    tempName: string
  }
}

export interface NoteState {
  notes: NoteItem[]
  activeFolder: Folder
  activeNoteId: string
  selectedNotesIds: string[]
  activeCategoryId: string
  error: string
  loading: boolean
  searchValue: string
}

export interface SettingsState {
  isOpen: boolean
  previewMarkdown: boolean
  loading: boolean
  darkTheme: boolean
  sidebarVisible: boolean
  notesSortKey: NotesSortKey
  codeMirrorOptions: { [key: string]: any }
}

export interface SyncState {
  syncing: boolean
  lastSynced: string
  error: string
  pendingSync: boolean
}

export interface RootState {
  categoryState: CategoryState
  noteState: NoteState
  settingsState: SettingsState
  syncState: SyncState
}

//==============================================================================
// API
//==============================================================================

export interface SyncPayload {
  categoryItems: CategoryItem[]
  noteItems: NoteItem[]
}

export interface IAuthState extends Partial<User> {
  token: string
}

//==============================================================================
// Events
//==============================================================================

export type ReactDragEvent = React.DragEvent<HTMLDivElement>

export type ReactMouseEvent =
  | MouseEvent
  | React.MouseEvent<HTMLDivElement>
  | React.ChangeEvent<HTMLSelectElement>

export type ReactSubmitEvent =
  | React.FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement>

//==============================================================================
// Default Types
//==============================================================================

// Taken from TypeScript private declared type within Actions
export type WithPayload<P, T> = T & {
  payload: P
}

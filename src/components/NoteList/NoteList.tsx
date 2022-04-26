import { Notes, Edit } from '@mui/icons-material'
import { ClickAwayListener } from '@mui/material'
import { FC, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { NoteItem } from '../../types'

type NoteListProps = {
  categoryId: string
  noteItems: NoteItem[]
  currentNoteId: string
  onEditNoteName: (noteId: string, title: string) => void
}

type ItemProps = {
  noteItem: NoteItem
  onEditNoteName: (noteId: string, title: string) => void
  isSelected: boolean
}

const Wrapper = styled.ul`
  margin: 0;
  list-style: none;
  padding: 0;
`

const ItemWrapper = styled.li<{ isSelected: boolean }>`
  display: flex;
  width: 100%;
  padding: 8px 8px 8px 35px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(209, 210, 211, 0.1)' : 'initial'};

  > .button-wrapper {
    visibility: hidden;
    gap: 5px;
  }

  :hover {
    > .button-wrapper {
      visibility: visible;
    }
    background-color: rgba(209, 210, 211, 0.1);
  }

  > span {
    display: flex;
    align-items: center;
  }
`

const Item: FC<ItemProps> = ({ noteItem, onEditNoteName, isSelected }) => {
  const navigate = useNavigate()
  const [isRenaming, setIsRenaming] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleEditNoteName = () => {
    setIsRenaming(false)
    onEditNoteName(noteItem.id, inputRef.current?.value ?? noteItem.title)
  }

  const navigateToNote = () => navigate(`/noteItems/${noteItem.id}`)

  return (
    <ItemWrapper isSelected={isSelected} onClick={navigateToNote}>
      <span>
        <Notes fontSize="inherit" sx={{ ml: 1, mr: 1 }} />
        {isRenaming ? (
          <ClickAwayListener onClickAway={handleEditNoteName}>
            <input ref={inputRef} defaultValue={noteItem.title} autoFocus />
          </ClickAwayListener>
        ) : (
          <span>{noteItem.title}</span>
        )}
      </span>
    </ItemWrapper>
  )
}

export const NoteList: FC<NoteListProps> = ({
  noteItems,
  categoryId,
  onEditNoteName,
  currentNoteId
}) => {
  return (
    <Wrapper>
      {noteItems
        .filter(({ categoryId: id }) => id === categoryId)
        .map((noteItem) => (
          <Item
            key={noteItem.id}
            noteItem={noteItem}
            onEditNoteName={onEditNoteName}
            isSelected={currentNoteId === noteItem.id}
          />
        ))}
    </Wrapper>
  )
}

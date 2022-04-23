import { Notes, Edit } from '@mui/icons-material'
import { ClickAwayListener } from '@mui/material'
import { FC, useRef, useState } from 'react'
import styled from 'styled-components'
import { NoteItem } from '../../types'

type NoteListProps = {
  categoryId: string
  noteItems: NoteItem[]
  onEditNoteName: (noteId: string, title: string) => void
}

type ItemProps = {
  noteItem: NoteItem
  onEditNoteName: (noteId: string, title: string) => void
}

const Wrapper = styled.ul`
  margin: 0;
  list-style: none;
  padding: 0;
`

const ItemWrapper = styled.li`
  display: flex;
  padding: 8px 8px 8px 40px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

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

const ButtonWrapper = styled.span<{ filled?: boolean }>`
  display: flex;
  cursor: pointer;
  padding: 6px;
  border-radius: 3px;
  ${({ filled }) =>
    filled
      ? `
      background-color: #fff;
      :hover {
        background-color: rgb(230, 230, 230);
      }
      :active {
        background-color: rgb(199, 199, 199);
      }
      `
      : `
    :hover {
      background-color: rgba(209, 210, 211, 0.1);
    }
    :active {
      background-color: rgba(209, 210, 211, 0.08);
    }
  `}
`

const Item: FC<ItemProps> = ({ noteItem, onEditNoteName }) => {
  const [isRenaming, setIsRenaming] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleEditNoteName = () => {
    setIsRenaming(false)
    console.log(inputRef.current?.value)
    onEditNoteName(noteItem.id, inputRef.current?.value ?? noteItem.title)
  }

  return (
    <ItemWrapper>
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
      <span className="button-wrapper">
        <ButtonWrapper onClick={() => setIsRenaming(true)}>
          <Edit fontSize="inherit" />
        </ButtonWrapper>
      </span>
    </ItemWrapper>
  )
}

export const NoteList: FC<NoteListProps> = ({
  noteItems,
  categoryId,
  onEditNoteName
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
          />
        ))}
    </Wrapper>
  )
}

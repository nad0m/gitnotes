import { FC, useRef, useState } from 'react'
import styled from 'styled-components'
import FolderIcon from '@mui/icons-material/Folder'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import EditIcon from '@mui/icons-material/Edit'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { CategoryItem } from '../../types'
import { Button, IconButton, Input } from '@mui/material'
import { ClickAwayListener } from '@mui/material'

type CategoryProps = {
  categoryItem: CategoryItem
  onAddNoteClick?: (categoryId: string) => void
  onEditCategoryName: (categoryId: string, name: string) => void
  onMenuButtonClick?: (categoryId: string) => void
}

const Wrapper = styled.div`
  display: flex;
  padding: 3px;
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
  }

  > span {
    display: flex;
    align-items: center;
  }
`

const ButtonWrapper = styled.span`
  display: flex;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  :hover {
    background-color: rgba(209, 210, 211, 0.1);
  }
  :active {
    background-color: rgba(209, 210, 211, 0.08);
  }
`

const ArrowIconWrapper = styled.span<{ isExpanded: boolean }>`
  width: 100%;
  .arrow-icon {
    transform: rotate(${({ isExpanded }) => (isExpanded ? '0deg' : '-90deg')});
    transition: all 0.1s linear;
  }
`

export const Category: FC<CategoryProps> = ({
  categoryItem,
  onAddNoteClick,
  onEditCategoryName,
  onMenuButtonClick
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const [isRenaming, setIsRenaming] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleRenameClick = () => {
    setIsRenaming(true)
  }

  const handleOnClickAway = () => {
    setIsRenaming(false)
    onEditCategoryName(
      categoryItem.id,
      inputRef.current?.value ?? categoryItem.name
    )
  }

  return (
    <Wrapper>
      <ArrowIconWrapper
        onClick={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}>
        <ArrowDropDownIcon className="arrow-icon" />
        <FolderIcon fontSize="inherit" sx={{ ml: 1, mr: 1 }} />
        {isRenaming ? (
          <ClickAwayListener onClickAway={handleOnClickAway}>
            <input
              ref={inputRef}
              defaultValue={categoryItem.name}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </ClickAwayListener>
        ) : (
          <span>{categoryItem.name}</span>
        )}
      </ArrowIconWrapper>
      <span className="button-wrapper">
        <ButtonWrapper onClick={handleRenameClick}>
          <EditIcon fontSize="inherit" />
        </ButtonWrapper>
        <ButtonWrapper>
          <NoteAddIcon fontSize="inherit" />
        </ButtonWrapper>
      </span>
    </Wrapper>
  )
}

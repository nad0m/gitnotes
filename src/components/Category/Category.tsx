import { FC, useRef, useState } from 'react'
import styled from 'styled-components'
import { ClickAwayListener } from '@mui/material'
import {
  Folder,
  NoteAdd,
  Edit,
  ArrowDropDown,
  Check,
  Cancel
} from '@mui/icons-material'
import { CategoryItem } from '../../types'

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

const ButtonWrapper = styled.span<{ filled?: boolean }>`
  display: flex;
  cursor: pointer;
  padding: 6px;
  border-radius: 3px;
  ${({ filled }) =>
    filled
      ? `
      background-color: rgb(230, 230, 230);
      :hover {
        background-color: rgb(193, 193, 193);
      }
      :active {
        background-color: rgb(169, 169, 169);
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
        <ArrowDropDown className="arrow-icon" />
        <Folder fontSize="inherit" sx={{ ml: 1, mr: 1 }} />
        {isRenaming ? (
          <ClickAwayListener onClickAway={handleOnClickAway}>
            <span style={{ display: 'flex', position: 'relative' }}>
              <input
                ref={inputRef}
                defaultValue={categoryItem.name}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              <span
                style={{
                  display: 'flex',
                  position: 'absolute',
                  right: '0',
                  top: '100%',
                  gap: '5px'
                }}>
                <ButtonWrapper filled>
                  <Check fontSize="inherit" color="success" />
                </ButtonWrapper>
                <ButtonWrapper filled>
                  <Cancel fontSize="inherit" color="error" />
                </ButtonWrapper>
              </span>
            </span>
          </ClickAwayListener>
        ) : (
          <span>{categoryItem.name}</span>
        )}
      </ArrowIconWrapper>
      <span className="button-wrapper">
        <ButtonWrapper onClick={handleRenameClick}>
          <Edit fontSize="inherit" />
        </ButtonWrapper>
        <ButtonWrapper>
          <NoteAdd fontSize="inherit" />
        </ButtonWrapper>
      </span>
    </Wrapper>
  )
}

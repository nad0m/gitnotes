import { FC, useRef, useState } from 'react'
import styled from 'styled-components'
import { ClickAwayListener, Collapse } from '@mui/material'
import {
  Folder,
  NoteAdd,
  Edit,
  ArrowDropDown,
  Check,
  Close
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
  padding: 8px 0;
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

const ArrowIconWrapper = styled.span<{ isExpanded: boolean }>`
  width: 100%;
  .arrow-icon {
    transform: rotate(${({ isExpanded }) => (isExpanded ? '0deg' : '-90deg')});
    transition: all 0.1s linear;
  }
`

export const Category: FC<CategoryProps> = ({
  children,
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

  const handleEditConfirm = () => {
    setIsRenaming(false)
    onEditCategoryName(
      categoryItem.id,
      inputRef.current?.value ?? categoryItem.name
    )
  }

  return (
    <div>
      <Wrapper>
        <ArrowIconWrapper
          onClick={() => setIsExpanded(!isExpanded)}
          isExpanded={isExpanded}>
          <ArrowDropDown className="arrow-icon" />
          <Folder fontSize="inherit" sx={{ ml: 1, mr: 1 }} />
          {isRenaming ? (
            <ClickAwayListener onClickAway={handleEditConfirm}>
              <span
                style={{ display: 'flex', position: 'relative' }}
                onClick={(e) => e.stopPropagation()}>
                <input
                  ref={inputRef}
                  defaultValue={categoryItem.name}
                  autoFocus
                />
                <span
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    right: '0',
                    top: '120%',
                    gap: '10px'
                  }}>
                  <ButtonWrapper onClick={handleEditConfirm} filled>
                    <Check fontSize="inherit" color="success" />
                  </ButtonWrapper>
                  <ButtonWrapper onClick={() => setIsRenaming(false)} filled>
                    <Close fontSize="inherit" color="error" />
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
      <Collapse in={isExpanded}>{children}</Collapse>
    </div>
  )
}

import { FC, useState } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Link, { LinkProps } from '@mui/material/Link'
import ListItem, { ListItemProps } from '@mui/material/ListItem'
import Collapse from '@mui/material/Collapse'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import {
  Link as RouterLink,
  Route,
  Routes,
  MemoryRouter,
  useLocation
} from 'react-router-dom'
import { CategoryItem, NoteItem } from '../../types'

interface ListItemLinkProps extends ListItemProps {
  to: string
  open?: boolean
}

const breadcrumbNameMap: { [key: string]: string } = {
  '/inbox': 'Inbox',
  '/inbox/important': 'Important',
  '/trash': 'Trash',
  '/spam': 'Spam',
  '/drafts': 'Drafts'
}

function Category(
  props: Pick<ListItemLinkProps, 'onClick' | 'open'> & CategoryItem
) {
  const { open, id, name, ...other } = props

  let icon = null
  if (open != null) {
    icon = open ? <ExpandLess /> : <ExpandMore />
  }

  return (
    <li>
      <ListItem {...other}>
        <ListItemText primary={name} />
        {icon}
      </ListItem>
    </li>
  )
}

function ListItemLink(props: ListItemLinkProps & NoteItem) {
  const { to, open, title, ...other } = props

  let icon = null
  if (open != null) {
    icon = open ? <ExpandLess /> : <ExpandMore />
  }

  return (
    <li>
      <ListItem button component={RouterLink as any} to={to} {...other}>
        <ListItemText primary={title} />
        {icon}
      </ListItem>
    </li>
  )
}

type RouterBreadcrumbsProps = {
  categoryItems: CategoryItem[]
  noteItems: NoteItem[]
}

export const RouterBreadcrumbs: FC<RouterBreadcrumbsProps> = ({
  categoryItems,
  noteItems
}) => {
  const [open, setOpen] = useState(true)

  const handleClick = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 360 }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          mt: 1,
          height: 1000
        }}
        component="nav"
        aria-label="mailbox folders">
        <List>
          {categoryItems.map((category) => (
            <>
              <Category
                key={category.id}
                open={open}
                onClick={handleClick}
                {...category}
              />
              <Collapse component="li" in={open} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {noteItems
                    .filter((noteItem) => noteItem.categoryId === category.id)
                    .map((noteItem) => (
                      <ListItemLink
                        key={noteItem.id}
                        sx={{ pl: 4 }}
                        to={`/noteItems/${noteItem.id}`}
                        {...noteItem}
                      />
                    ))}
                </List>
              </Collapse>
            </>
          ))}
          {noteItems
            .filter((noteItem) => !noteItem.categoryId)
            .map((noteItem) => (
              <ListItemLink
                key={noteItem.id}
                sx={{ pl: 4 }}
                to={`/noteItems/${noteItem.id}`}
                {...noteItem}
              />
            ))}
        </List>
      </Box>
    </Box>
  )
}

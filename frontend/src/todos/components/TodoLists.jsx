import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ReceiptIcon from '@mui/icons-material/Receipt'
import {
  Alert,
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { Fragment, useState } from 'react'
import { useFetchData } from '../../hooks/useFetchData'
import { LoadingIndicator } from './LoadingIndicator'
import { TodoList } from './TodoList'

const NoTodoListsMessage = ({ style }) => (
  <Card style={style}>
    <CardContent>
      <Typography variant='body1'>No todo lists found.</Typography>
    </CardContent>
  </Card>
)

export const TodoLists = ({ style }) => {
  const [activeTodoListId, setActiveTodoListId] = useState(null)
  const { data: todoLists, isLoading, error, refetch } = useFetchData('/todo-lists')

  const handleTodoListClick = (id) => {
    setActiveTodoListId(id)
  }

  // Only show full page loading and error messages for initial load (not refetch)
  if (todoLists === null) {
    if (error)
      return (
        <Alert severity='error' style={style}>
          Something went wrong while fetching todo lists.
        </Alert>
      )

    if (isLoading) return <LoadingIndicator />
  }

  if (!todoLists?.length) return <NoTodoListsMessage style={style} />

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          {error && (
            <Alert severity='error' style={{ marginTop: '0.5rem' }}>
              Something went wrong while updating todo lists.
            </Alert>
          )}
          <List>
            {todoLists.map(({ id, title, completed }) => (
              <ListItemButton key={id} onClick={() => handleTodoListClick(id)}>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={title} />
                {completed && (
                  <ListItemIcon>
                    <CheckCircleIcon color='success' />
                  </ListItemIcon>
                )}
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
      {activeTodoListId && (
        <TodoList key={activeTodoListId} id={activeTodoListId} onUpdate={refetch} />
      )}
    </Fragment>
  )
}

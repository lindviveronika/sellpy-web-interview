import ReceiptIcon from '@mui/icons-material/Receipt'
import {
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
import { TodoList } from './TodoList'

export const TodoLists = ({ style }) => {
  const [activeTodoListId, setActiveTodoListId] = useState(null)
  const { data: todoLists, isLoading, error } = useFetchData('/todo-lists')

  const handleTodoListClick = (id) => {
    setActiveTodoListId(id)
  }

  if (isLoading) return <div>Loading todos...</div>
  if (error) return <div>Something went wrong while fetching todo lists.</div>
  if (!todoLists?.length) return <div>No todo lists found.</div>

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {todoLists.map(({ id, title }) => (
              <ListItemButton key={id} onClick={() => handleTodoListClick(id)}>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={title} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
      {activeTodoListId && <TodoList key={activeTodoListId} id={activeTodoListId} />}
    </Fragment>
  )
}

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
import { Fragment } from 'react'
import { useFetchData } from '../../hooks/useFetchData'
import { useTriggerFetchData } from '../../hooks/useTriggerFetchData'
import { TodoListForm } from './TodoListForm'

export const TodoLists = ({ style }) => {
  const { data: todoLists, isLoading, error } = useFetchData('/todo-lists')
  const { trigger: fetchTodoList, data: activeTodoList } = useTriggerFetchData()

  const handleSaveTodoList = (id, { todos }) => {
    // TODO: implement saving updated todo list
    console.log('save', id, todos)
  }

  const handleTodoListClick = (id) => {
    fetchTodoList(`/todo-lists/${id}`)
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
      {activeTodoList && (
        <TodoListForm
          key={activeTodoList.id} // use key to make React recreate component to reset internal state
          todoList={activeTodoList}
          saveTodoList={handleSaveTodoList}
        />
      )}
    </Fragment>
  )
}

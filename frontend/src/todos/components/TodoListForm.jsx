import AddIcon from '@mui/icons-material/Add'
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { useState } from 'react'
import { TodoItem } from './TodoItem'

export const TodoListForm = ({ todoList, saveTodoList, isSaving }) => {
  const [todos, setTodos] = useState(todoList.todos)
  const [lastSave, setLastSave] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await saveTodoList({ todos })
    setLastSave(result.error ? { status: 'error', todos } : { status: 'success', todos })
  }

  const handleChangeTodoName = (index, name) => {
    const newTodos = [...todos.slice(0, index), name, ...todos.slice(index + 1)]
    setTodos(newTodos)
  }

  const handleDeleteTodo = (index) => {
    setTodos([...todos.slice(0, index), ...todos.slice(index + 1)])
  }

  const handleAddTodo = () => {
    setTodos([...todos, ''])
  }

  // Only show status message if the todo reference hasn't changed since the last save
  const saveStatus = lastSave?.todos === todos ? lastSave.status : null

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {todos.map((name, index) => (
            <TodoItem
              number={index + 1}
              name={name}
              onNameChange={(name) => handleChangeTodoName(index, name)}
              onDelete={() => handleDeleteTodo(index)}
            />
          ))}
          <CardActions>
            <Button type='button' color='primary' onClick={handleAddTodo}>
              Add Todo <AddIcon />
            </Button>
            <Button type='submit' variant='contained' color='primary' disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            {saveStatus && (
              <Typography color={saveStatus === 'error' ? 'error' : 'green'} variant='body2'>
                {saveStatus === 'error'
                  ? 'Something went wrong while saving the todo list.'
                  : 'Todo list saved successfully.'}
              </Typography>
            )}
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}

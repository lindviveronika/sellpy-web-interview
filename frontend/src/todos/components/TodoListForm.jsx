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

  const handleChangeTodoName = (id, name) => {
    const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, name } : todo))
    setTodos(updatedTodos)
  }

  const handleCompletedUpdate = (id, completed) => {
    const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
    setTodos(updatedTodos)
  }

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleAddTodo = () => {
    const id = crypto.randomUUID()
    const newTodos = [...todos, { id, name: '', completed: false }]
    setTodos(newTodos)
  }

  // Only show status message if the todo reference hasn't changed since the last save
  const saveStatus = lastSave?.todos === todos ? lastSave.status : null

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2' style={{ marginBottom: '1rem' }}>
          {todoList.title}
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '1rem' }}
        >
          {todos.map(({ id, name, completed }, index) => (
            <TodoItem
              key={id}
              number={index + 1}
              name={name}
              completed={completed}
              onNameChange={(name) => handleChangeTodoName(id, name)}
              onDelete={() => handleDeleteTodo(id)}
              onCompleteChange={(completed) => handleCompletedUpdate(id, completed)}
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

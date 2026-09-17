import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material'
import { useState } from 'react'

export const TodoListForm = ({ todoList, saveTodoList, isSaving }) => {
  const [todos, setTodos] = useState(todoList.todos)
  const [lastSave, setLastSave] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await saveTodoList({ todos })
    setLastSave(result.error ? { status: 'error', todos } : { status: 'success', todos })
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
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={name}
                onChange={(event) => {
                  setTodos([
                    // immutable update
                    ...todos.slice(0, index),
                    event.target.value,
                    ...todos.slice(index + 1),
                  ])
                }}
              />
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={() => {
                  setTodos([
                    // immutable delete
                    ...todos.slice(0, index),
                    ...todos.slice(index + 1),
                  ])
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, ''])
              }}
            >
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

import AddIcon from '@mui/icons-material/Add'
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { TodoItem } from './TodoItem'

const DEBOUNCE_DELAY = 300
const SAVE_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
}

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)
  const [lastSave, setLastSave] = useState(null)

  const latestTodos = useRef()
  const timeoutRef = useRef(null)

  const updateLastSave = (todos, result) => {
    setLastSave({ todos, status: result.error ? SAVE_STATUS.ERROR : SAVE_STATUS.SUCCESS })
  }

  const saveTodos = async (todos) => {
    const result = await saveTodoList({ todos })
    updateLastSave(todos, result)
  }

  const updateTodos = async (updatedTodos, debounce = false) => {
    latestTodos.current = updatedTodos
    setTodos(updatedTodos)

    clearTimeout(timeoutRef.current)
    timeoutRef.current = null

    if (debounce) {
      timeoutRef.current = setTimeout(async () => {
        timeoutRef.current = null
        const todos = latestTodos.current
        await saveTodos(todos)
      }, DEBOUNCE_DELAY)
      return
    }

    await saveTodos(updatedTodos)
  }

  const handleChangeTodoName = (id, name) => {
    updateTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, name } : todo)),
      true,
    )
  }

  const handleCompletedUpdate = (id, completed) => {
    updateTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)))
  }

  const handleDeleteTodo = (id) => {
    updateTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleAddTodo = () => {
    const id = crypto.randomUUID()
    updateTodos([...todos, { id, name: '', completed: false }])
  }

  useEffect(() => {
    return async () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        await saveTodoList({ todos: latestTodos.current }) // flush debounced changes
      }
    }
  }, [saveTodoList])

  // Only show status message if the todo reference hasn't changed since the last save
  // New reference is created each time the todos state is updated
  const saveStatus = lastSave && lastSave.todos === todos ? lastSave.status : null

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2' style={{ marginBottom: '1rem' }}>
          {todoList.title}
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '1rem' }}>
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
            {saveStatus === SAVE_STATUS.ERROR && (
              <Typography variant='body2' color='error'>
                Failed to save changes.
              </Typography>
            )}
          </CardActions>
        </div>
      </CardContent>
    </Card>
  )
}

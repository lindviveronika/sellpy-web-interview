import { Alert } from '@mui/material'
import { useCallback } from 'react'
import { useFetchData } from '../../hooks/useFetchData'
import { fetchData } from '../../utils/fetchData'
import { LoadingIndicator } from './LoadingIndicator'
import { TodoListForm } from './TodoListForm'

export const TodoList = ({ id, onUpdate }) => {
  const { data: todoList, isLoading, error } = useFetchData(`/todo-lists/${id}`)

  const handleSaveTodoList = useCallback(
    async ({ todos }) => {
      const result = await fetchData(`/todo-lists/${id}/todos`, {
        method: 'PUT',
        body: JSON.stringify({ todos }),
      })

      if (onUpdate && !result.error) {
        onUpdate()
      }

      return result
    },
    [id, onUpdate],
  )

  if (isLoading) return <LoadingIndicator />

  if (error)
    return (
      <Alert style={{ margin: '0 1rem' }} severity='error'>
        Something went wrong while fetching the todo list.
      </Alert>
    )

  return <TodoListForm todoList={todoList} saveTodoList={handleSaveTodoList} />
}

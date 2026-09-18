import { useCallback } from 'react'
import { useFetchData } from '../../hooks/useFetchData'
import { fetchData } from '../../utils/fetchData'
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

  if (isLoading) return <div>Loading todo list...</div>
  if (error) return <div>Something went wrong while fetching the todo list.</div>
  if (!todoList) return <div>Todo list not found.</div>

  return <TodoListForm todoList={todoList} saveTodoList={handleSaveTodoList} />
}

import { useState } from 'react'
import { useFetchData } from '../../hooks/useFetchData'
import { fetchData } from '../../utils/fetchData'
import { TodoListForm } from './TodoListForm'

export const TodoList = ({ id, onUpdate }) => {
  const [isSaving, setIsSaving] = useState(false)
  const { data: todoList, isLoading, error } = useFetchData(`/todo-lists/${id}`)

  const handleSaveTodoList = async ({ todos }) => {
    setIsSaving(true)

    const result = await fetchData(`/todo-lists/${id}/todos`, {
      method: 'PUT',
      body: JSON.stringify({ todos }),
    })

    setIsSaving(false)

    if (onUpdate && !result.error) {
      onUpdate()
    }

    return result
  }

  if (isLoading) return <div>Loading todo list...</div>
  if (error) return <div>Something went wrong while fetching the todo list.</div>
  if (!todoList) return <div>Todo list not found.</div>

  return <TodoListForm todoList={todoList} saveTodoList={handleSaveTodoList} isSaving={isSaving} />
}

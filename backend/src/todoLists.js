import express from 'express'

const router = express.Router()

class TodoList {
  constructor(id, title, todos) {
    this.id = id
    this.title = title
    this.todos = todos
  }
}

const todoLists = new Map([
  ['0000000001', new TodoList('0000000001', 'First List', [])],
  ['0000000002', new TodoList('0000000002', 'Second List', [])],
])

// Todo list is not considered completed if it has no todos
function isCompleted(todoList) {
  return todoList.todos.length > 0 && todoList.todos.every((todo) => todo.completed)
}

function toSummary(todoList) {
  return {
    id: todoList.id,
    title: todoList.title,
    completed: isCompleted(todoList),
  }
}

function toDetailed(todoList) {
  return {
    ...toSummary(todoList),
    todos: todoList.todos,
  }
}

function validateUniqueIds(ids) {
  return ids.length === new Set(ids).size
}

function validateTodo(todo) {
  return (
    todo &&
    typeof todo === 'object' &&
    typeof todo.name === 'string' &&
    typeof todo.completed === 'boolean' &&
    typeof todo.id === 'string'
  )
}

function validateTodos(data) {
  return (
    data &&
    Array.isArray(data.todos) &&
    data.todos.every(validateTodo) &&
    validateUniqueIds(data.todos.map((todo) => todo.id))
  )
}

router.param('id', (req, res, next, id) => {
  const todoList = todoLists.get(id)

  if (!todoList) {
    res.status(404).send('Todo list not found')
    return
  }

  req.todoList = todoList
  next()
})

router.get('/', (_req, res) => res.json(Array.from(todoLists.values()).map(toSummary)))

router.get('/:id', (req, res) => {
  res.json(toDetailed(req.todoList))
})

router.put('/:id/todos', (req, res) => {
  const todoList = req.todoList
  const data = req.body

  if (!validateTodos(data)) {
    res.status(400).send('Invalid request body')
    return
  }

  todoList.todos = data.todos
  res.json(toDetailed(todoList))
})

export default router

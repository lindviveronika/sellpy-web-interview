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

router.get('/', (_req, res) =>
  res.json(
    Array.from(todoLists.values()).map((todoList) => ({ id: todoList.id, title: todoList.title })),
  ),
)

router.get('/:id', (req, res) => {
  res.json(req.todoList)
})

router.put('/:id/todos', (req, res) => {
  const todoList = req.todoList
  const data = req.body

  if (!validateTodos(data)) {
    res.status(400).send('Invalid request body')
    return
  }

  todoList.todos = data.todos
  res.json(todoList)
})

export default router

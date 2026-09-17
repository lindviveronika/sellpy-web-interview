import express from 'express'

const router = express.Router()

const todoLists = new Map([
  [
    '0000000001',
    {
      id: '0000000001',
      title: 'First List',
      todos: ['First todo of first list!'],
    },
  ],
  [
    '0000000002',
    {
      id: '0000000002',
      title: 'Second List',
      todos: ['First todo of second list!'],
    },
  ],
])

function validateTodos(data) {
  return data && Array.isArray(data.todos) && data.todos.every((todo) => typeof todo === 'string')
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

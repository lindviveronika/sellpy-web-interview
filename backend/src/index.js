import cors from 'cors'
import express from 'express'
import todoListsRouter from './todoLists.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/todo-lists', todoListsRouter)

const PORT = 3001

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

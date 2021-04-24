const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')

app.use(express.json())

app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Lo que sea',
    date: '2019-05-03T19:34:23.235Z',
    important: true
  },
  {
    id: 2,
    content: 'Lo que sea',
    date: '2019-05-03T19:34:23.235Z',
    important: true
  },
  {
    id: 3,
    content: 'Lo que sea',
    date: '2019-05-03T19:34:23.235Z',
    important: true
  },
  {
    id: 4,
    content: 'Lo que sea',
    date: '2019-05-03T19:34:23.235Z',
    important: true
  },
  {
    id: 5,
    content: 'Lo que sea',
    date: '2019-05-03T19:34:23.235Z',
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  if (!note || !note.content) {
    response.status(400).json({
      message: 'note.content is missing'
    })
    return
  }

  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: new Date(),
    important: typeof note.important === 'boolean' ? note.important : false
  }

  notes = [
    ...notes,
    newNote
  ]

  console.log(newNote)
  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    message: 'No se encuentra la pagina'
  })
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

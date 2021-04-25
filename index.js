require('dotenv').config()

require('./mongo')

const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const app = express()

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

const logger = require('./middleware/logger')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

const Note = require('./models/Note')

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(express.json())
app.use('/images', express.static('images'))

app.use(logger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id

  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id

  Note.findByIdAndRemove(id).then(result => {
    response.status(204).end()
  }).catch(error => {
    next(error)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
  const id = request.params.id

  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then(result => {
    response.json(result)
  }).catch(error => {
    next(error)
  })
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    response.status(400).json({
      message: 'note.content is missing'
    })
    return
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: typeof note.important === 'boolean' ? note.important : false
  })

  newNote.save().then(savedNote => {
    response.status(201).json(savedNote)
  })
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.use(notFound)
app.use(handleError)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

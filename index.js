require('dotenv').config()

require('./mongo')

const express = require('express')
const cors = require('cors')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const app = express()
const logger = require('./middleware/logger')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')
const Note = require('./models/Note')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const User = require('./models/User')
const userExtractor = require('./middleware/userExtractor')

app.use(cors())
app.use(express.json())
app.use('/images', express.static('images'))

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

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(logger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1,
    _id: 0
  })
  response.json(notes)
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

app.delete('/api/notes/:id', userExtractor, async (request, response, next) => {
  const id = request.params.id

  try {
    await Note.findByIdAndRemove(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.put('/api/notes/:id', userExtractor, (request, response, next) => {
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

app.post('/api/notes', userExtractor, async (request, response, next) => {
  const {
    content,
    important
  } = request.body

  const user = await User.findById(request.userId)

  console.log(user)

  if (!content) {
    response.status(400).json({
      message: 'note.content is missing'
    })
    return
  }

  const newNote = new Note({
    content: content,
    date: new Date(),
    important: typeof mportant === 'boolean' ? important : false,
    user: user.toJSON().id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.use(notFound)
app.use(handleError)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

module.exports = { app, server }

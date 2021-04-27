const { server } = require('../index')
const mongoose = require('mongoose')

const Note = require('../models/Note')

const { initialNotes, api, getAllContentFromNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = initialNotes.map(note => new Note(note))
  const promises = noteObjects.map(note => note.save())
  await Promise.all(promises)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('there first note is about jorgerb', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(note => note.content)

  expect(contents).toContain('Contenido 1 de jorgerb')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'Nueva nota',
    important: true
  }

  await api.post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const { contents, response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length + 1)

  expect(contents).toContain(newNote.content)
})

test('an invalid note can not be added', async () => {
  const newNote = {}

  await api.post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
})

test('a note can be deleted', async () => {
  const { response } = await getAllContentFromNotes()
  const { body: notes } = response
  const noteToDelete = notes[0]

  await api.delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const { contents, response: newResponse } = await getAllContentFromNotes()
  expect(newResponse.body).toHaveLength(initialNotes.length - 1)

  expect(contents).not.toContain(noteToDelete.content)
})

test('a note that does not exist can not be deleted', async () => {
  await api.delete('/api/notes/1234')
    .expect(400)

  const { response: newResponse } = await getAllContentFromNotes()
  expect(newResponse.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

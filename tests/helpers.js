const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)
const User = require('../models/User')

const initialNotes = [
  {
    content: 'Contenido 1 de jorgerb',
    important: true,
    date: new Date()
  },
  {
    content: 'Contenido 2',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes,
  getUsers
}

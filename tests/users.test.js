const { server } = require('../index')
const mongoose = require('mongoose')

const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')

describe.only('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('psw', 10)
    const user = new User({
      username: 'jorge',
      passwordHash
    })

    await user.save()
  })

  test('create a new user', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'jorgerb',
      name: 'jorge',
      password: 'twitch'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const userNames = usersAtEnd.map(user => user.username)
    expect(userNames).toContain(newUser.username)
  })

  test('creation fail if user already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'jorge',
      name: 'jorge',
      password: 'twitch'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error.errors.username.message).toContain('`username` to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})

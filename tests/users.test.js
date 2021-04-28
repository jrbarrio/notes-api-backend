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
    const usersAtStart = getUsers()

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
})

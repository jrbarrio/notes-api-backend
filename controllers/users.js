const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User')

userRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, password } = body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUSer = await user.save()

  response
    .status(201)
    .json(savedUSer)
})

module.exports = userRouter

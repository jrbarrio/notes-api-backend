module.exports = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    response.status(400).end(response.sentry + '\n')
  } else {
    response.status(500).end(response.sentry + '\n')
  }
}

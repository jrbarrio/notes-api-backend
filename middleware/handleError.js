const ERROR_HANDLERS = {
  CastError: (response, error) => response.status(400).end(response.sentry + '\n'),
  ValidationError: (response, error) => response.status(409).send({
    error: error.message
  }),
  JsonWebTokenError: (response, error) => response.status(401).json({
    error: 'Invalid token'
  }),
  defaultError: (response, error) => response.status(500).end(response.sentry + '\n')
}

module.exports = (error, request, response, next) => {
  console.error(error)
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handler(response, error)
}

module.exports = (request, response) => {
  response.status(404).json({
    message: 'No se encuentra la pagina'
  })
}

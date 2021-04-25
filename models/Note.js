const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

notesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', notesSchema)

module.exports = Note

// Note.find({}).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })

// const note = new Note({
//   content: 'Esta es tu nota',
//   date: new Date(),
//   important: true
// })

// note.save()
//   .then(() => {
//     console.log('Note saved in DB')
//     mongoose.connection.close()
//   })
//   .catch(() => console.error('Error saving note in DB'))

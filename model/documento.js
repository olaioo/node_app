const mongoose = require('./connection')

const documentoSchema = new mongoose.Schema({
    content: {type: String, minlength: 3, required: true} ,
    important: {type: Boolean, default: false},
    pessoa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pessoa'
    }
})

documentoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Documento', documentoSchema)
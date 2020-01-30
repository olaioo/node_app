const mongoose = require('./connection')

const pessoaSchema = new mongoose.Schema({
    name: {type: String, minlength: 3, required: true, unique: true},
    passwordHash: {type: String, required: true},
    age: {type: Number, required: true},
    documentos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Documento'
        }
    ]
})

pessoaSchema.set('toJSON', {
    transform: (documento, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Pessoa', pessoaSchema)
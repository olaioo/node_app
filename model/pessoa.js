require('dotenv').config()
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = process.env.MONGODB_URL

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(result => {
        console.log('connected to MongoDB')  })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const pessoaSchema = new mongoose.Schema({
    name: {type: String, minlength: 3, required: true} ,
    age: {type: Number, required: true}
})

pessoaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Pessoa', pessoaSchema)
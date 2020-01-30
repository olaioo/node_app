require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

console.log('connecting to', url)

const params = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}

mongoose.connect(url, params)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

module.exports = mongoose
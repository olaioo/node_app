const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const Pessoa = require('../model/pessoa')

router.post('/', async (request, response) => {
    const body = request.body

    const pessoa = await Pessoa.findOne({ name: body.name })
    const passwordCorrect = pessoa === null
        ? false
        : await bcrypt.compare(body.password, pessoa.passwordHash)

    if (!(pessoa && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid name or password'
        })
    }

    const pessoaForToken = {
        name: pessoa.name,
        id: pessoa._id,
    }

    const token = jwt.sign(pessoaForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, name: pessoa.name })
})

module.exports = router
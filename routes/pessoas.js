var express = require('express');
var router = express.Router();
var Pessoa = require('../model/pessoa');
const bcrypt = require('bcrypt');

const saltRounds = 10;

router.get('/', async (request, response) => {
    const pessoas = await Pessoa.find({}).populate('documentos', {content: 1, important: 1})
    try {
        response.json(pessoas)
    } catch (error) {
        response.sendStatus(404)
    }
})

router.get('/:id', (request, response) => {
    Pessoa.findById(request.params.id).then(note => {
        response.json(note.toJSON())
    }).catch(error => response.sendStatus(404))
})

router.post('/', async (request, response) => {
    const body = request.body
    const passHass = body.password ? await bcrypt.hash(body.password, saltRounds) : body.passwordHash

    delete body['password']
    const pessoa = Pessoa({ ...request.body, passwordHash: passHass })

    pessoa.save().then(savedPessoa => {
        response.json(savedPessoa.toJSON())
    }).catch(error => response.status(400).json({ error: error.message }))
})

router.put('/:id', (request, response) => {
    const body = request.body

    Pessoa.findByIdAndUpdate(request.params.id, body, { new: true }).then(updatedNote => {
        response.json(updatedNote.toJSON())
    }).catch(error => response.status(400).json({ error: error.message }))
})

router.delete('/:id', (request, response) => {
    Pessoa.findByIdAndRemove(request.params.id).then(result => {
        if (!result) {
            response.sendStatus(404)
        } else {
            response.sendStatus(204)
        }
    }).catch(error => response.sendStatus(404))
})

module.exports = router;

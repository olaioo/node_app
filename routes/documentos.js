var express = require('express');
var router = express.Router();
var Documento = require('../model/documento');
var Pessoa = require('../model/pessoa');

router.get("/", (request, response) => {
    Documento.find({}).populate('pessoa', { name: 1, age: 1 })
        .then(documentos => {
            response.json(documentos)
        }).catch(error => response.status(404).json({ error: error.message }))
})

router.post("/", async (request, response) => {
    if (request.body.pessoa) {
        const pessoa = await Pessoa.findById(request.body.pessoa)
        const documento = new Documento({ ...request.body, pessoa: pessoa._id })
        try {
            const savedDocumento = await documento.save()
            pessoa.documentos = pessoa.documentos.concat(savedDocumento)
            await pessoa.save()
            response.json(savedDocumento.toJSON())
        } catch (error) {
            response.status(400).json({ error: error.message })
        }
    } else {
        const documento = new Documento(request.body)
        try {
            const savedDocumento = await documento.save()
            response.json(savedDocumento.toJSON())
        } catch (error) {
            response.status(400).json({ error: error.message })
        }
    }
})

module.exports = router;
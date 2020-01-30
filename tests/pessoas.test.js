const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Pessoa = require('../model/pessoa')
const bcrypt = require('bcrypt')
const baseUrl = '/pessoas/'

const initialPessoas = [
    {
        name: "Joao",
        age: 15,
        passwordHash: "$2b$10$WANQtP988lm.CRobkOx4iu2VBUo4IU0ocngcATpmt5d9gorsUHhnG"
    },
    {
        name: "Maria",
        age: 18,
        passwordHash: "$2b$10$WANQtP988lm.CRobkOx4iu2VBUo4IU0ocngcATpmt5d9gorsUHhnG"
    },
    {
        name: "Cleber",
        age: 20,
        passwordHash: "$2b$10$WANQtP988lm.CRobkOx4iu2VBUo4IU0ocngcATpmt5d9gorsUHhnG"
    }
]

const nonExistingId = async (Schema, pessoa) => {
    const object = new Schema(pessoa)
    await object.save()
    await object.remove()

    return object._id.toString()
}

const pessoasInDb = async () => {
    const res = await api.get(baseUrl)
    return res.body
}

beforeEach(async () => {
    await Pessoa.deleteMany({})

    const pessoasObjects = initialPessoas.map(pessoa => new Pessoa(pessoa))
    const promiseArray = pessoasObjects.map(pessoaObject => pessoaObject.save())
    await Promise.all(promiseArray)
})

describe('Pessoa service', () => {
    const pessoaTesteInsercao = {
        name: "Teste",
        age: 15,
        password: "123456789"
    }

    const pessoaTestePass = {
        name: "Teste",
        age: 15,
        passwordHash: "$2b$10$WANQtP988lm.CRobkOx4iu2VBUo4IU0ocngcATpmt5d9gorsUHhnG"
    }

    describe('Recuperando informações', () => {
        test('todas pessoas foram encontradas', async () => {
            const res = await api.get(baseUrl)
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(initialPessoas.length)
            expect(res.body.map(pessoa => pessoa.name)).toEqual(initialPessoas.map(pessoa => pessoa.name))
        })

        test('busca uma pessoa especifica válida', async () => {
            const pessoas = await pessoasInDb()
            const primeiraPessoa = pessoas[0]

            const resBuscaPrimeiraPessoa = await api.get(baseUrl + "/" + primeiraPessoa.id)
            expect(resBuscaPrimeiraPessoa.status).toBe(200)
            expect(resBuscaPrimeiraPessoa.body).toEqual(primeiraPessoa)
        })

        test('busca uma pessoa especifica inválida', async () => {
            const id = await nonExistingId(Pessoa, pessoaTestePass)

            const resBuscaPrimeiraPessoa = await api.get(baseUrl + "/" + id)
            expect(resBuscaPrimeiraPessoa.status).toBe(404)
        })
    })

    describe('Adicionando informações', () => {
        test('adição valida nova pessoa', async () => {
            const res = await api.post(baseUrl).send(pessoaTesteInsercao)
            expect(res.status).toBe(200)
            expect(res.body.name).toBe(pessoaTesteInsercao.name)

            const resList = await api.get(baseUrl)
            expect(resList.status).toBe(200)
            expect(resList.body.length).toBe(initialPessoas.length + 1)
            expect(resList.body.map(pessoa => pessoa.name)).toContain(pessoaTesteInsercao.name)
        })

        test('adição invalida nova pessoa', async () => {
            const resOnlyName = await api.post(baseUrl).send({ name: "Teste", passwordHash: "$2b$10$WANQtP988lm.CRobkOx4iu2VBUo4IU0ocngcATpmt5d9gorsUHhnG"})
            expect(resOnlyName.status).toBe(400)

            const resOnlyAge = await api.post(baseUrl).send({ age: 15, passwordHash: "$2b$10$WANQtP988lm.CRobkOx4iu2VBUo4IU0ocngcATpmt5d9gorsUHhnG"})
            expect(resOnlyAge.status).toBe(400)

            const resEmptyObject = await api.post(baseUrl).send({})
            expect(resOnlyAge.status).toBe(400)

            const resList = await api.get(baseUrl)
            expect(resList.status).toBe(200)
            expect(resList.body.length).toBe(initialPessoas.length)
        })
    })

    describe('Removendo informações', () => {
        test('deleta uma pessoa válida', async () => {
            const pessoas = await pessoasInDb()
            const primeiraPessoa = pessoas[0]

            const resDeletaPessoa = await api.delete(baseUrl + "/" + primeiraPessoa.id)
            expect(resDeletaPessoa.status).toBe(204)

            const pessoasDepois = await pessoasInDb()
            expect(pessoasDepois.length).toBe(initialPessoas.length - 1)
        })

        test('deleta uma pessoa inválida', async () => {
            const id = await nonExistingId(Pessoa, pessoaTestePass)

            const resDeletaPessoa = await api.delete(baseUrl + "/" + id)
            expect(resDeletaPessoa.status).toBe(404)

            const pessoasDepois = await pessoasInDb()
            expect(pessoasDepois.length).toBe(initialPessoas.length)
        })
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})

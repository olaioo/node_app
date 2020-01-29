const createPessoa = require('../tests/pessoas').create
const baseUrl = 'http://localhost:3001/pessoas'

describe('Serviço Pessoa', () => {
    const pessoaTeste = {
        name: "Teste",
        age: 15
    }

    test('de adição correta', () => {
        const res=createPessoa(pessoaTeste)
        expect(response.status).toBe(200)
        expect(response.data).toBe(pessoaTeste)
    })
})

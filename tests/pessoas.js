import axios from 'axios'
const baseUrl = 'http://localhost:3001/pessoas'

const getAll = () => {
    return axios.get(baseUrl).then(response => response)
}

const create = newObject => {
    return axios.post(baseUrl, newObject).then(response => response)
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(response => response)
}

export default {
    getAll: getAll,
    create: create,
    update: update
}
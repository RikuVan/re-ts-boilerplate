import axios from 'axios'
import { compose, prop, groupWith, equals, split, take, head, map } from 'ramda'

const API_ROOT = 'https://dog.ceo/api'
const BREED_LIST_URL = `${API_ROOT}/breeds/list`

const getHead = compose(take(1), split(''))
const groupByFirstLetter = groupWith((x: string, y: string) =>
  equals(getHead(x), getHead(y))
)
const addFirstLetters = (data: any[]) => ({
  dogs: data,
  letters: compose(map(head), map(head))(data)
})
const processBreeds = compose(
  addFirstLetters,
  groupByFirstLetter,
  prop('message')
)

const resources = {
  breeds: {
    url: () => BREED_LIST_URL,
    process: processBreeds
  },
  images: { url: (breed: string = '') => `${API_ROOT}/breed/${breed}/images` }
}

const request = async ({ resource = '', method = 'get', id = null }) => {
  const remote = resources[resource]
  const url = remote.url(id)
  const process = remote.process ? remote.process : (v: any): any => v
  try {
    const { data, status } = await axios[method](url, {
      method,
      headers: { 'Content-Type': 'application/json' }
    })
    console.log(data)
    return { data: process(data), status }
  } catch (error) {
    return { error: error.response }
  }
}

export default request

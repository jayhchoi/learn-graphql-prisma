import 'cross-fetch/polyfill'
import '@babel/polyfill/noConflict'
import prisma from '../src/prisma'
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import {
  getPosts,
  myPosts,
  updatePost,
  createPost,
  deletePost
} from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should return public posts only', async () => {
  const response = await client.query({ query: getPosts })

  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

test('Should fetch all my posts', async () => {
  const client = getClient(userOne.jwt) // Authenticated client

  const { data } = await client.query({ query: myPosts })

  expect(data.myPosts.length).toBe(2)
})

test('Should be able to update own post', async () => {
  const client = getClient(userOne.jwt)

  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  }

  const { data } = await client.mutate({ mutation: updatePost, variables })
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  })
  expect(exists).toBe(true)
  expect(data.updatePost.published).toBe(false)
})

test('Should create a post', async () => {
  const client = getClient(userOne.jwt)

  const variables = {
    data: { title: 'test', body: 'test', published: true }
  }

  const { data } = await client.mutate({ mutation: createPost, variables })
  expect(data.createPost.title).toBe('test')
  expect(data.createPost.body).toBe('test')
  expect(data.createPost.published).toBe(true)
})

test('Should delete post', async () => {
  const client = getClient(userOne.jwt)

  const variables = {
    id: postTwo.post.id
  }

  await client.mutate({ mutation: deletePost, variables })
  const exists = await prisma.exists.Post({ id: postTwo.post.id })
  expect(exists).toBe(false)
})

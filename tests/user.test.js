import 'cross-fetch/polyfill'
import '@babel/polyfill/noConflict'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, getUsers, loginUser, getProfile } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
  const variables = {
    data: {
      name: 'Jay Choi',
      email: 'test1@gmail.com',
      password: 'testPassword123'
    }
  }

  const response = await client.mutate({
    // Sending mutation query(request) to my local node server
    mutation: createUser,
    variables
  })

  const userExists = await prisma.exists.User({
    id: response.data.createUser.user.id
  })

  expect(userExists).toBe(true)
})

test('Should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('Jon Doe')
})

test('Should not login with bad credentials', async () => {
  const variables = {
    data: {
      email: 'johnd@gmail.com',
      password: 'WrongPassword123'
    }
  }

  // Expect this operation to throw an error
  await expect(
    client.mutate({ mutation: loginUser, variables })
  ).rejects.toThrow()
})

test('Should not create user with short password', async () => {
  const variables = {
    data: {
      name: 'Jay Choi',
      email: 'test1@gmail.com',
      password: 'short'
    }
  }

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow()
})

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt) // Authenticated client

  const { data } = await client.query({ query: getProfile })

  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)
})

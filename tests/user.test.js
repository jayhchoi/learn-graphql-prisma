import 'cross-fetch/polyfill'
import '@babel/polyfill/noConflict'
import ApolloClient, { gql } from 'apollo-boost'
import bcrypt from 'bcryptjs'
import prisma from '../src/prisma'

const client = new ApolloClient({
  uri: 'http://localhost:4000'
})

beforeEach(async () => {
  // Runs before each test
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()
  const user = await prisma.mutation.createUser({
    // This goes directly to prisma, NOT local node server
    data: {
      name: 'Jon Doe',
      email: 'johnd@gmail.com',
      password: bcrypt.hashSync('MyPassword123')
    }
  })
  await prisma.mutation.createPost({
    data: {
      title: 'Test Post Published',
      body: 'Test body1',
      published: true,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  })
  await prisma.mutation.createPost({
    data: {
      title: 'Test Post Unpublished',
      body: 'Test body2',
      published: false,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  })
})

test('Should create a new user', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Jay Choi"
          email: "test1@gmail.com"
          password: "MyPassword123"
        }
      ) {
        token
        user {
          id
          name
        }
      }
    }
  `

  const response = await client.mutate({
    // Sending mutation query(request) to my local node server
    mutation: createUser
  })

  const userExists = await prisma.exists.User({
    id: response.data.createUser.user.id
  })

  expect(userExists).toBe(true)
})

test('Should expose public author profiles', async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `

  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('Jon Doe')
})

test('Should return public posts only', async () => {
  const getPosts = gql`
    query {
      posts {
        title
        body
        published
      }
    }
  `

  const response = await client.query({ query: getPosts })

  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

// test('Should not login with bad credentials', async () => {
//   const login = gql`
//     mutation {
//       login(data: { email: "bad@gmail.com", password: "badPassword" }) {
//         token
//       }
//     }
//   `

//   await expect(client.mutate({ mutation: login })).rejects.toThrow()
// })

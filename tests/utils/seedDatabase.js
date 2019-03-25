import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

export const userOne = {
  input: {
    name: 'Jon Doe',
    email: 'johnd@gmail.com',
    password: bcrypt.hashSync('MyPassword123')
  },
  user: undefined,
  jwt: undefined
}

export const postOne = {
  input: {
    title: 'Test Post Published',
    body: 'Test body1',
    published: true
  },
  post: undefined
}

export const postTwo = {
  input: {
    title: 'Test Post Unpublished',
    body: 'Test body2',
    published: false
  },
  post: undefined
}

export default async () => {
  // Runs before each test
  // Clear test data
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  // Create userOne
  userOne.user = await prisma.mutation.createUser({
    // This goes directly to prisma, NOT local node server
    data: userOne.input
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })
}

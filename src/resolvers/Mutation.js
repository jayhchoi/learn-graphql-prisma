import bcrypt from 'bcryptjs'

import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    // Hasing
    const password = await hashPassword(data.password)

    const user = await prisma.mutation.createUser({
      data: { ...data, password }
    })

    // Return custom object
    return {
      user,
      token: generateToken(user.id)
    }
  },
  async loginUser(parent, { data }, { prisma }, info) {
    // Login is all about VERIFYING credentials and RETURNING a token
    const user = await prisma.query.user({
      where: {
        email: data.email
      }
    }) // No info arg => all primitive types returned

    if (!user) throw new Error('User not found')

    const passwordIsMatch = await bcrypt.compare(data.password, user.password)

    if (!passwordIsMatch) throw new Error('Unable to login')

    // Return is always necessary before testing
    return {
      user,
      token: generateToken(user.id)
    }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser({ where: { id: userId } }, info)
  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    if (typeof data.password === 'string')
      data.password = await hashPassword(data.password)

    return prisma.mutation.updateUser({ where: { id: userId }, data }, info)
  },
  async createPost(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.createPost(
      {
        data: {
          ...data,
          author: {
            connect: { id: userId }
          }
        }
      },
      info
    )
  },
  async deletePost(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)

    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    })

    if (!postExists) throw new Error('Unable to delete post')

    return prisma.mutation.deletePost({ where: { id } }, info)
  },
  async updatePost(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)

    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    })

    if (!postExists) throw new Error('Unable to update post')

    const postPublished = await prisma.exists.Post({
      id,
      author: {
        id: userId
      },
      published: true
    })

    if (postPublished && !data.published) {
      // Delete all comments
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id
          }
        }
      })
    }

    return prisma.mutation.updatePost({ where: { id }, data }, info)
  },
  async createComment(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    const postPublished = await prisma.exists.Post({
      id: data.post,
      published: true
    })

    if (!postPublished) throw new Error('Unable to create comment')

    return prisma.mutation.createComment(
      {
        data: {
          ...data,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: data.post
            }
          }
        }
      },
      info
    )
  },
  async deleteComment(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)

    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    })

    if (!commentExists) throw new Error('Unable to delete comment')

    return prisma.mutation.deleteComment({ where: { id } }, info)
  },
  async updateComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)

    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    })

    if (!commentExists) throw new Error('Unable to update comment')

    return prisma.mutation.updateComment({ where: { id }, data }, info)
  }
}

export default Mutation

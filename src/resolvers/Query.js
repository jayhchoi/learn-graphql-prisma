import getUserId from '../utils/getUserId'

// @Public
// @Returns all users
const Query = {
  users(parent, { query, first, skip, after, orderBy }, { prisma }, info) {
    const opArgs = {
      first,
      skip,
      after,
      orderBy
    }

    if (query) {
      opArgs.where = {
        OR: [
          {
            name_contains: query
          }
        ]
      }
    }

    return prisma.query.users(opArgs, info)
  },
  // @Public
  // @Return published posts only
  posts(parent, { query, first, skip, after, orderBy }, { prisma }, info) {
    const opArgs = {
      where: {
        published: true
      },
      first,
      skip,
      after,
      orderBy
    }

    if (query) {
      opArgs.where.OR = [
        {
          title_contains: query
        },
        {
          body_contains: query
        }
      ]
    }

    return prisma.query.posts(opArgs, info)
  },
  // @Private
  // @Return own posts
  myPosts(
    parent,
    { query, first, skip, after, orderBy },
    { prisma, request },
    info
  ) {
    const userId = getUserId(request)

    const opArgs = {
      where: {
        author: {
          id: userId
        }
      },
      first,
      skip,
      after,
      orderBy
    }

    if (query) {
      opArgs.where.OR = [
        {
          title_contains: query
        },
        {
          body_contains: query
        }
      ]
    }

    return prisma.query.posts(opArgs, info)
  },
  // @Public
  // @Returns all comments
  comments(parent, { query, first, skip, after, orderBy }, { prisma }, info) {
    const opArgs = {
      first,
      skip,
      after,
      orderBy
    }

    if (query) {
      opArgs.where = {
        text_contains: query
      }
    }

    return prisma.query.comments(opArgs, info)
  },
  // @Private
  // @Returns current user(me)
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.query.user(
      {
        where: {
          id: userId
        }
      },
      info
    )
  },
  // @Private & Public
  // @Grab post by id only when it's public OR owned
  async post(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request, false) // Returns null if not authenticated

    const posts = await prisma.query.posts(
      {
        where: {
          id,
          OR: [
            {
              published: true
            },
            {
              author: {
                id: userId
              }
            }
          ]
        }
      },
      info
    )

    if (posts.length === 0) throw new Error('Posts not found')

    return posts[0]
  }
}

export default Query

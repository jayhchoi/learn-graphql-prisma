import getUserId from '../utils/getUserId'

const User = {
  // @Private
  email: {
    // Without fragment, there's no parent.id if id subfield is not provided in query
    // Thus fragment allows me to get parent.id even if client does not ask for it in query
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false)

      if (userId && userId === parent.id) return parent.email

      return null
    }
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts(
        {
          where: {
            AND: [
              {
                author: {
                  id: parent.id
                }
              },
              {
                published: true
              }
            ]
          }
        },
        info
      )
    }
  }
}

export default User

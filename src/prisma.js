import { Prisma } from 'prisma-binding' // This is a binder between prisma and nodejs
import { fragmentReplacements } from './resolvers'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements
})

export default prisma

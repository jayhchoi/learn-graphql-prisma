import jwt from 'jsonwebtoken'

import { MY_SECRET } from '../config/keys'

const getUserId = (request, requireAuth = true) => {
  // Get http authorization header
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization

  if (!header) {
    if (requireAuth) throw new Error('Authentication required')

    return null
  }

  // Verify token
  const token = header.replace('Bearer ', '')
  const decoded = jwt.verify(token, MY_SECRET) // This verifies AND THEN decodes

  return decoded.userId
}

export default getUserId

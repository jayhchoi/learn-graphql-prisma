import jwt from 'jsonwebtoken'
import { MY_SECRET } from '../config/keys'

const generateToken = userId => {
  return jwt.sign({ userId }, MY_SECRET, { expiresIn: '10h' })
}

export default generateToken

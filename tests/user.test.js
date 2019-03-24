import { getFirstName, isValidPassword } from '../src/utils/user'

test('Should return first name when given full name', () => {
  const firstName = getFirstName('Jay Choi')

  expect(firstName).toBe('Jay')
})

test('Should reject password shorter than 8 chars', () => {
  const isValid = isValidPassword('1234567')

  expect(isValid).toBe(false)
})

test('Should reject password shorter than 8 chars', () => {
  const isValid = isValidPassword('123Password')

  expect(isValid).toBe(false)
})

test('Should correctly validate a valid password', () => {
  const isValid = isValidPassword('abcd1234!!')

  expect(isValid).toBe(true)
})

import { getFirstName } from '../src/utils/user'

test('Should return first name when given full name', () => {
  const firstName = getFirstName('Jay Choi')

  if (firstName !== 'Jay') {
    throw new Error('Test failed')
  }
})

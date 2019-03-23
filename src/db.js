const users = [
  {
    id: '1',
    name: 'Jay Choi',
    email: 'jaychoi1619@gmail.com',
    age: '30'
  },
  {
    id: '2',
    name: 'Soohee Shin',
    email: 'soohee@gmail.com',
    age: '29'
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'jd@gmail.com',
    age: '40'
  }
]

const posts = [
  {
    id: '1',
    title: 'My Article One',
    body: 'lorem',
    published: true,
    author: '3'
  },
  {
    id: '2',
    title: 'My Article Two',
    body: 'lorem',
    published: true,
    author: '1'
  },
  {
    id: '3',
    title: 'My Article Three',
    body: 'lorem',
    published: true,
    author: '1'
  }
]

const comments = [
  {
    id: '1',
    text:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa, fuga!',
    author: '1',
    post: '1'
  },
  {
    id: '2',
    text:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa, fuga!',
    author: '2',
    post: '1'
  },
  {
    id: '3',
    text:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa, fuga!',
    author: '2',
    post: '3'
  },
  {
    id: '4',
    text:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa, fuga!',
    author: '3',
    post: '3'
  }
]

const db = {
  users,
  posts,
  comments
}

export default db

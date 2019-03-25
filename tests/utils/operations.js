import { gql } from 'apollo-boost'

// USER
const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

const loginUser = gql`
  mutation($data: LoginUserInput!) {
    loginUser(data: $data) {
      token
    }
  }
`

const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`

const getProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
`

// POST
const getPosts = gql`
  query {
    posts {
      title
      body
      published
    }
  }
`

const myPosts = gql`
  query {
    myPosts {
      title
      body
      published
      author {
        id
        name
        email
      }
    }
  }
`

const updatePost = gql`
  mutation($id: ID!, $data: UpdatePostInput!) {
    updatePost(id: $id, data: $data) {
      id
      title
      body
      published
    }
  }
`

const createPost = gql`
  mutation($data: CreatePostInput!) {
    createPost(data: $data) {
      id
      title
      body
      published
    }
  }
`

const deletePost = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`

export {
  createUser,
  loginUser,
  getUsers,
  getProfile,
  getPosts,
  myPosts,
  updatePost,
  createPost,
  deletePost
}

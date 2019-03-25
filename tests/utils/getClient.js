import ApolloClient from 'apollo-boost'

export default jwt => {
  return new ApolloClient({
    uri: 'http://localhost:4000',
    request(operation) {
      // Set http Authorization header ONLY IF jwt is provided
      if (jwt) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        })
      }
    }
  })
}

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
      # how to return array?? 
    savedBooks: 
  }

  type Book {
    _id: ID!
    authors: String!
    description: String!
    bookID: String!
    image: String!
    link: String!
    title: String!
  }

  type Query {
    singleUser(_id: String): [User]
    books: [Book]
  }

  type Mutation {
    ## am i passing correct params?
    createUser(body: User!): User
    login(body: User!): User
    saveBook(_id: String!, book: String!): User
    deleteBook(_id: String!, book: String!): User
  }
`;

module.exports = typeDefs;
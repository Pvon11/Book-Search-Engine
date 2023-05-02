const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }
  type Auth {
    token: ID!
    user: User
  }
  type Book {
    _id: ID
    authors: [String]
    description: String!
    bookId: String
    image: String
    link: String
    title: String!
  }

  type Query {
    users: [User]
    user(userId: ID!): User
    me: User
  }

  input BookInput {
    authors: [String!]
    description: String!
    bookId: String
    image: String
    link: String
    title: String!
  }
  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: BookInput, _id: ID!): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;

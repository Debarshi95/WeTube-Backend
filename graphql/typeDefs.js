const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    getUsers: [User!]
  }

  type User {
    id: ID!
    username: String!
    token: String!
  }

  type Mutation {
    registerUser(
      username: String!
      password: String!
      confirmPassword: String!
    ): User!
    loginUser(username: String!, password: String!): User!
  }
`;

const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    getAllVideos: [Video!]!
    getAllCategories: [Category!]!
    getAllComments: [Comment!]
    getVideoByCategory(categoryName: String!): [Video!]!
    getVideoById(videoId: String!): Video!
  }

  type User {
    id: ID!
    username: String!
    token: String!
  }

  type Comment {
    id: ID!
    content: String!
    user: User!
    video: Video!
  }

  type Video {
    id: ID!
    title: String!
    description: String
    url: String!
    thumbnail: String!
    categories: [Category!]!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    videos: [Video!]!
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

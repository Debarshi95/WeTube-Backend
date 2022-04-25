const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    getAllVideos: [Video!]!
    getAllCategories: [Category!]!
    getAllComments: [Comment!]
    getVideoByCategory(categoryName: String!): [Video!]!
    getVideoById(videoId: Int): Video!
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
    likes: Int
    viewCount: Int
    url: String!
    imageUrl: String!
    categoryId: [Category]!
    uploadedBy: User!
  }

  type Category {
    id: ID!
    name: String!
    videoId: [Video!]!
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

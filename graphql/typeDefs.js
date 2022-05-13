const { gql } = require('apollo-server')

module.exports = gql`
  type Query {
    getAllVideos: [Video!]!
    getAllCategories: [Category!]!
    getAllComments: [Comment!]
    getAllViews: [View!]
    getAllWatch: [Watch!]
    getAllPlaylists: [Playlist!]
    getVideoByCategory(categoryName: String!): [Video!]!
    getVideoById(videoId: String!): Video!
    getUser(token: String!): User!
  }

  type User {
    id: ID!
    username: String!
    token: String!
    pic: String!
    email: String!
    views: [View!]
    likes: [Like!]
  }
  type Watch {
    id: ID!
    user: User
    video: Video!
  }

  type Message {
    message: String
    success: Boolean
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
    user: User!
    views: Int!
    likes: [Like]
  }

  type Category {
    id: ID!
    name: String!
    videos: [Video!]!
  }

  type Playlist {
    id: ID!
    name: String!
    videos: [Video!]
    user: User!
  }

  type View {
    id: ID!
    user: User
    video: Video!
  }
  type Like {
    id: ID!
    like: Int!
    user: User!
    video: Video!
  }

  type Mutation {
    registerUser(
      email: String!
      username: String!
      password: String!
      confirmPassword: String!
    ): User!
    loginUser(email: String!, password: String!): User!
    logoutUser: Message!
    updateView(videoId: String!): Message!
    deleteView(viewId: String, type: String): Message!
    updateLike(videoId: String!): Message!
    createPlaylist(name: String!, videoId: String!): Message!
    updatePlaylist(playlistId: String!, videoId: String!): Message!
    deletePlaylist(playlistId: String!, videoId: String, type: String): Message!
    updateWatchLater(videoId: String!): Message!
  }
`

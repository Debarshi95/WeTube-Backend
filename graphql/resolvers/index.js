const userResolver = require('./user')
const videoResolver = require('./video')
const categoryResolver = require('./category')
const commentResolver = require('./comment')
const playlistResolver = require('./playlist')

module.exports = {
  Query: {
    ...videoResolver.Query,
    ...categoryResolver.Query,
    ...commentResolver.Query,
    ...userResolver.Query,
    ...playlistResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...playlistResolver.Mutation,
  },
}

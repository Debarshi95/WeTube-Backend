const userResolver = require('./user');
const videoResolver = require('./video');
const categoryResolver = require('./category');
const commentResolver = require('./comment');

module.exports = {
  Query: {
    ...videoResolver.Query,
    ...categoryResolver.Query,
    ...commentResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
  },
};

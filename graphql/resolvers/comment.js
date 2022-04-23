const { UserInputError } = require('apollo-server-express');
const { Videos, Comments, User } = require('../../models');

const getAllComments = async () => {
  try {
    const comments = await Comments.findAll({
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: Videos,
          as: 'video',
        },
      ],
    });
    console.log({ comments });
    return comments;
  } catch (error) {
    throw new UserInputError(error);
  }
};

module.exports = {
  Query: {
    getAllComments,
  },
};

const { UserInputError } = require('apollo-server-express');
const { Videos, Category, User } = require('../../models');

const getAllVideos = async () => {
  try {
    const videos = await Videos.findAll({
      include: [
        { model: User, as: 'uploadedBy' },
        { model: Category, as: 'categoryId' },
      ],
    });

    return videos;
  } catch (err) {
    console.log({ err });
    throw new UserInputError(err);
  }
};

module.exports = {
  Query: {
    getAllVideos,
  },
};

const { UserInputError } = require('apollo-server-express');
const { Op } = require('sequelize');
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
const getVideoById = async (_, args) => {
  try {
    const video = await Videos.findOne({
      where: {
        id: {
          [Op.eq]: args.videoId,
        },
      },
      include: [
        {
          model: Category,
          as: 'categoryId',
        },
        { model: User, as: 'uploadedBy' },
      ],
    });
    console.log({ video });
    return video;
  } catch (error) {
    throw new UserInputError(error);
  }
};
module.exports = {
  Query: {
    getAllVideos,
    getVideoById,
  },
};
